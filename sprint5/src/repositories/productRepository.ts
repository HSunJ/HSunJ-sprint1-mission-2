import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

import { GetProductListParams } from "../types/product.d";

async function getById(userId: string | undefined, id: string) {
  return await prisma.product.findUnique({
    select:{
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
    where: {
      id,
    },
  });
}

// async function getListById(id: string) {
//   return await prisma.product.findMany({
//     where: {
//       userId: id,
//     }
//   });
// }

async function getList(userId: string | undefined, 
  { keyword, order, offset, limit }: GetProductListParams) {
  const orderBy: Prisma.ProductOrderByWithRelationInput = order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };
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
    where: keyword ? {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
      ]
    } : undefined,
    orderBy,
    skip: offset,
    take: limit
  });
}

// async function save(product) {
//   return await prisma.product.create({
//     data: {
//       name: product.name,
//       description: product.description,
//       price: parseInt(product.price, 10),
//     },
//   });
// }

export default {
  getById,
  // getListById,
  getList,
  // save,
};
