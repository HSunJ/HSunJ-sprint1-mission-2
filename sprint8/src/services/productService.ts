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

class ProductService {
  public async getProductList(userId: string | undefined, params: GetProductListParams): Promise<DisplayProductListItem[]> {
    const products: ProductListItem[] = await productRepository.getList(userId, params);

    const displayProductList: DisplayProductListItem[] = products.map((product) => {
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

  public async getProduct(userId: string | undefined, id: string): Promise<ProductDetail> {
    const product: ProductDetail = await productRepository.getById(userId, id);

    const isLiked = product.likedUser ? product.likedUser.length > 0 : false;
    const displayProduct: DisplayProductDetail = {
      id: product.id,
      name: product.name,
      price: product.price,
      createdAt: product.createdAt,
      isLiked
    }
    return displayProduct;
  }

  public async createProduct(input: ProductCreateInput, userId: string | undefined): Promise<DisplayCreateProduct> {
    const product: DisplayCreateProduct = await productRepository.createProduct(input, userId);

    const displayProduct = {
      ...product,
      isLiked: false
    }
    return displayProduct;
  }

  public async patchProduct(userId: string | undefined, id: string, input: Partial<ProductCreateInput>): Promise<DisplayProductDetail> {
    const product: ProductDetail = await productRepository.patchProduct(id, userId, input);
    if (!product) {
      throw new appError.NotFoundError("상품이 존재하지 않습니다");
    }

    const isLiked = product.likedUser ? product.likedUser.length > 0 : false;
    const displayProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tag: product.tag,
      createdAt: product.createdAt,
      isLiked
    }
    return displayProduct;
  }

  public async deleteProduct(userId: string | undefined, id: string): Promise<void>{
    await productRepository.deleteProduct(id, userId);
  }

  public async isLiked(userId: string | undefined, id: string): Promise<boolean> {
    const product = await productRepository.getById(userId, id);
    if (!product) {
      throw new appError.NotFoundError("게시글이 존재하지 않습니다");
    }
    return product.likedUser ? product.likedUser.length > 0 : false;
  }

  public async likeProduct(userId: string | undefined, id: string): Promise<void> {
    await productRepository.like(id, {
      likedUser: {
        connect: { id: userId }
      }
    });
  }

  public async unlikeProduct(userId: string | undefined, id: string): Promise<void> {
    await productRepository.unlike(id, {
      likedUser: {
        disconnect: { id: userId }
      }
    });
  }
}

const productService = new ProductService();
export default productService;