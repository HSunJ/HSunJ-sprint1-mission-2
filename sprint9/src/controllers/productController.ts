import { CreateProduct, PatchProduct } from '../structs';
import { assert } from "superstruct";
import { RequestHandler } from "express";

import productService from "../services/productService";
import appError from '../utils/appError';
import { $Enums } from '@prisma/client';


export const getProductList: RequestHandler = async (req, res) => {
  const { offset = 0, limit = 10, order = "recent", keyword = "" } = req.query;
  const userId = req.user?.userId;

  const products = await productService.getProductList(userId, {
    keyword: keyword as string,
    order: order as string,
    offset: Number(offset),
    limit: Number(limit)
  });

  res.status(200).send(products);
};

export const getProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const product = await productService.getProduct(userId, id);

  res.status(200).send(product);
};

export const createProduct: RequestHandler = async (req, res) => {
  assert(req.body, CreateProduct);
  const userId = req.user?.userId;
  const body = {
    ...req.body,
    tag: req.body.tag as $Enums.Tags
  }

  const product = await productService.createProduct(body, userId);
  res.status(201).send(product);
};

export const patchProduct: RequestHandler = async (req, res) => {
  assert(req.body, PatchProduct);
  const { id } = req.params;
  const userId = req.user?.userId;
  const body = {
    ...req.body,
    tag: req.body.tag as $Enums.Tags
  }

  const product = await productService.patchProduct(userId, id, body);
  res.status(202).send(product);
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;  
  const userId = req.user?.userId;

  await productService.deleteProduct(userId, id);
  res.status(204).send({ message: "게시글이 삭제되었습니다" });
};

export const likeProduct: RequestHandler = async (req, res) => {
  const userId = req.user?.userId;
  const id = req.params.id;

  if (await productService.isLiked(userId, id)) {
    await productService.unlikeProduct(userId, id);
    res.status(201).json({ message: "좋아요가 취소되었습니다." });
  }
  else {
    await productService.likeProduct(userId, id);
    res.status(201).json({ message: "좋아요를 눌렀습니다" });
  }
}