import { CreateProduct, PatchProduct } from '../structs';
import { assert } from "superstruct";
import { RequestHandler } from "express";

import { ProductListItem, DisplayProductListItem, ProductDetail, DisplayProductDetail } from "../types/product";
import appError from "../utils/appError";
import productRepository from "../repositories/productRepository";

export const getProducts: RequestHandler = async (req, res) => {
  const { offset = 0, limit = 10, order = "recent", keyword = "" } = req.query;
  const userId = req.user?.userId;

  const products: ProductListItem[] = await productRepository.getList(userId, {
    keyword: keyword as string,
    order: order as string,
    offset: Number(offset),
    limit: Number(limit)
  });

  if (!products){
    throw new appError.NotFoundError("상품이 존재하지 않습니다");
  }

  const displayProductList: DisplayProductListItem[] = products.map((product) => {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      createdAt: product.createdAt,
      isLiked: product.likedUser ? product.likedUser.length > 0 : false
    }
  });
  res.status(200).send(displayProductList);
};

export const getProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const product: ProductDetail | null = await productRepository.getById(userId, id);

  if (!product) {
    throw new appError.NotFoundError("상품이 존재하지 않습니다");
  }

  const displayProduct: DisplayProductDetail = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tag: product.tag,
    createdAt: product.createdAt,
    isLiked: product.likedUser ? product.likedUser.length > 0 : false
  }

  res.status(200).send(displayProduct);
};

export const createProduct: RequestHandler = async (req, res) => {
  assert(req.body, CreateProduct);
  const userId = req.user?.userId;
  const product = await productRepository.createProduct(req.body, userId);
  res.status(201).send(product);
};

export const patchProduct: RequestHandler = async (req, res) => {
  assert(req.body, PatchProduct);
  const { id } = req.params;
  const userId = req.user?.userId;
  const product = await productRepository.patchProduct(id, userId, req.body);
  res.status(202).send(product);
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  await productRepository.deleteProduct(id, userId);
  res.sendStatus(204);
};

export const likeProduct: RequestHandler = async (req, res) => {
  const userId = req.user?.userId;
  const id = req.params.id;
  const likedUser = await productRepository.getLikedUser(id, userId);

  if (!likedUser) {
    throw new appError.NotFoundError("상품이 존재하지 않습니다");
  }

  if (likedUser.length > 0) {
    // 좋아요 해제
    await productRepository.unlikeProduct(id, userId);
    res.status(201).json({ message: "좋아요가 취소되었습니다." });
  }
  else {
    await productRepository.likeProduct(id, userId);
    res.status(201).json({ message: "좋아요를 눌렀습니다" });
  }
}