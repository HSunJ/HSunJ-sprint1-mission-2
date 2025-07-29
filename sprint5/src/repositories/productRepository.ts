import prisma from "../config/prisma.js";

import { GetProductListParams } from "../types/product.d";

async function getById(id: string) {
  return await prisma.product.findUnique({
    where: {
      id,
    },
  });
}

async function getListById(id: string) {
  return await prisma.product.findMany({
    where: {
      userId: id,
    }
  });
}

async function getList(userId: string, { where, orderBy, offset, limit }: GetProductListParams) {
  return await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
      likedUser: userId ? {
        where: { id: userId },
        select: { id: true }
      } : false
    },
    where,
    orderBy,
    skip: offset,
    take: limit
  })
}

async function save(product) {
  return await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      price: parseInt(product.price, 10),
    },
  });
}

export default {
  getById,
  getListById,
  save,
};
