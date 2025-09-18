import prisma from "../config/prisma";
import productRepository from "../repositories/productRepository";
import {
  ProductListItem,
  GetProductListParams,
  DisplayProductListItem,
  ProductDetail,
  DisplayProductDetail,
  DisplayCreateProduct,
  ProductCreateInput
} from "../types/product";
import appError from "../utils/appError";
import { io } from "../socket";
import { connectedUsers } from "../socket/handler/connectionHandler";
import { joinRoom, leaveRoom } from "../utils/roomUtils";
import notificationService from "./notificationServices";

class ProductService {
  public async getProductList(userId: string, params: GetProductListParams) {
    const products = await productRepository.getList(userId, params);

    const displayProductList = products.map((product) => {
      const isLiked = product.likedUser ? product.likedUser.length > 0 : false;
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        createdAt: product.createdAt,
        isLiked
      }
    });
    return displayProductList;
  }

  public async getProduct(userId: string, id: string) {
    const product = await productRepository.getById(userId, id);

    const isLiked = product.likedUser ? product.likedUser.length > 0 : false;
    const displayProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      createdAt: product.createdAt,
      isLiked
    }
    return displayProduct;
  }

  public async createProduct(input: ProductCreateInput, userId: string) {
    const product = await productRepository.createProduct(input, userId);

    const displayProduct = {
      ...product,
      isLiked: false
    }
    return displayProduct;
  }

  public async patchProduct(userId: string, id: string, input: Partial<ProductCreateInput>) {
    return await prisma.$transaction(async (tx) => {
      const oldProduct = await productRepository.getById(userId, id, tx, { price: true }) as unknown as { price: number };
      const product = await productRepository.patchProduct(id, userId, input, tx);
      if (!product) {
        throw new appError.NotFoundError("상품이 존재하지 않습니다");
      }

      if (oldProduct.price !== product.price && product.likedUser.length > 0) {
        // 가격이 변경된 경우에 대한 처리
        const likedUsers = product.likedUser.map(user => user.id);
        const productData = {
          id,
          name: product.name,
          oldprice: oldProduct.price,
          newprice: product.price,
          likedUsers
        };

        const notifications = await notificationService.createPriceChangeNotifications(productData);
      }

      const isLiked = product.likedUser.filter(user => user.id === userId)
      const displayProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        tag: product.tag,
        createdAt: product.createdAt,
        isLiked: isLiked.length > 0
      }
      return displayProduct;
    })
  }

  public async deleteProduct(userId: string, id: string) {
    await productRepository.deleteProduct(id, userId);
  }

  public async isLiked(userId: string, id: string) {
    const product = await productRepository.getById(userId, id);
    if (!product) {
      throw new appError.NotFoundError("게시글이 존재하지 않습니다");
    }
    return product.likedUser ? product.likedUser.length > 0 : false;
  }

  public async likeProduct(userId: string, id: string) {
    await productRepository.like(id, {
      likedUser: {
        connect: { id: userId }
      }
    });

    // 유저를 상품 ID룸에 추가
    const userSockets = connectedUsers.get(userId);
    if (userSockets) joinRoom(`product:${id}`, io, userSockets);
  }

  public async unlikeProduct(userId: string, id: string) {
    await productRepository.unlike(id, {
      likedUser: {
        disconnect: { id: userId }
      }
    });

    // 유저를 상품 ID룸에서 제거
    const userSockets = connectedUsers.get(userId!);
    if (userSockets) leaveRoom(`product:${id}`, io, userSockets);
  }
}

const productService = new ProductService();
export default productService;