import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

import { GetProductListParams, ProductListItem, ProductDetail, ProductCreateInput, DisplayCreateProduct } from "../types/product.d";

async function getById(userId: string | undefined, id: string): Promise<ProductDetail | null> {
  return await prisma.product.findUnique({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tag: true,
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
  { keyword, order, offset, limit }: GetProductListParams): Promise<ProductListItem[]> {
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

async function createProduct(productInput: ProductCreateInput, userId: string | undefined): Promise<DisplayCreateProduct> {
  return await prisma.product.create({
    data: {
      ...productInput,
      author: { connect: { id: userId } }
    }
  });
}

const patchProduct = async (id: string, userId: string | undefined, data: Prisma.ProductUpdateInput): Promise<ProductDetail | null> => {
  return await prisma.product.update({
    where: {
      id,
      userId
    },
    data
  })
}

const deleteProduct = async (id: string, userId: string | undefined): Promise<void> => {
  await prisma.product.delete({
    where: {
      id,
      userId
    }
  });
}

const getLikedUser = async (id: string, userId: string | undefined): Promise<{ id: string; }[] | null> => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      likedUser: {
        where: { id: userId },
        select: { id: true }
      }
    }
  })
  return product ? product.likedUser : null
}

const likeProduct = async (id: string, userId: string | undefined): Promise<void> => {
  await prisma.product.update({
    where: { id },
    data: { likedUser: { connect: { id: userId } } }
  });
}

const unlikeProduct = async (id: string, userId: string | undefined): Promise<void> => {
  await prisma.product.update({
    where: { id },
    data: { likedUser: { disconnect: { id: userId } } }
  });
};

export default {
  getById,
  // getListById,
  getList,
  createProduct,
  patchProduct,
  deleteProduct,
  getLikedUser,
  likeProduct,
  unlikeProduct,
};
