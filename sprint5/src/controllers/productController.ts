import { Prisma } from "@prisma/client";
import { PatchProduct } from '../structs';
import { assert, is } from "superstruct";
import { RequestHandler } from "express";
import prisma from "../config/prisma";

import { ProductListItem, DisplayProductListItem, ProductDetail, DisplayProductDetail, CreatedProductListItem } from "../types/product";
import productRepository from "../repositories/productRepository";
import userRepository from "../repositories/userRepository";

export const getProducts: RequestHandler = async (req, res) => {
  const { offset = 0, limit = 10, order = "recent", keyword = "" } = req.query;
  const orderBy: Prisma.ProductOrderByWithRelationInput = order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };
  const userId = req.user?.userId;

  const products: ProductListItem[] = productRepository.getList(userId, {
    where: keyword ? {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
      ]
    } : undefined,
    orderBy,
    offset: Number(offset),
    limit: Number(limit)
  })

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

  const product: ProductDetail = await prisma.product.findUniqueOrThrow({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      likedUser: userId ? {
        where: { id: userId },
        select: { id: true }
      } : false,
      createdAt: true
    },
    where: { id },
  });

  const isLiked = product.likedUser ? product.likedUser.length > 0 : false;
  const displayProduct: DisplayProductDetail = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    createdAt: product.createdAt,
    isLiked
  }

  res.status(200).send(displayProduct);
};

export const createProduct: RequestHandler = async (req, res) => {
  const product = await prisma.product.create({
    data: {
      ...req.body,
      userId: req.user.userId,
    },
  });
  res.status(201).send(product);
};

export const patchProduct: RequestHandler = async (req, res) => {
  assert(req.body, PatchProduct);
  const { id } = req.params;
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...req.body,
      userId: req.user.userId,
    }
  });
  res.status(202).send(product);
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({
    where: { id },
  });
  res.sendStatus(204);
};

export const likeProduct: RequestHandler = async (req, res) => {
  const userId = req.user.userId;
  const id = req.params.id;
  const product = await prisma.product.findUnique({
    where: {
      id
    },
    select: {
      likedUser: {
        where: { id: userId },
        select: { id: true }
      }
    }
  })

  if (!product) {
    const error = new Error("상품이 존재하지 않습니다");
    error.status = 404;
    throw error;
  }

  if (product.likedUser.length > 0) {
    // 좋아요 해제
    await prisma.product.update({
      where: { id },
      data: {
        likedUser: { disconnect: { id: userId } }
      }
    });
    res.status(201).json({ message: "좋아요가 취소되었습니다." });
  }
  else {
    await prisma.product.update({
      where: { id },
      data: { likedUser: { connect: { id: userId } } }
    });
    res.status(201).json({ message: "좋아요를 눌렀습니다" });
  }
}