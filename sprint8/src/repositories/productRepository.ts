import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

import { GetProductListParams, ProductListItem, ProductDetail, ProductCreateInput, DisplayCreateProduct } from "../types/product.d";

class ProductRepository {
  public async getList(userId: string,
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

  public async getById(userId: string, id: string, tx?: Prisma.TransactionClient, select?: any) {
    const defaultSelect = {
      id: true,
      name: true,
      description: true,
      price: true,
      tag: true,
      createdAt: true,
      likedUser: userId ? {
        where: { id: userId },
        select: { id: true }
      } : false,
    }
    return await (tx || prisma).product.findUniqueOrThrow({
      select: select || defaultSelect,
      where: {
        id,
      },
    });
  }

  public async getLiked(userId: string, id: string) {
    return await prisma.product.findUnique({
      select: {
        likedUser: { where: { id: userId }, select: { id: true } }
      },
      where: { id },
    });
  }

  public async createProduct(input: ProductCreateInput, userId: string) {
    return await prisma.product.create({
      data: {
        ...input,
        author: { connect: { id: userId } }
      },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true
      }
    });
  }

  public async patchProduct(id: string, userId: string, data: Partial<ProductCreateInput>, tx?: Prisma.TransactionClient) {
    return await (tx || prisma).product.update({
      where: {
        id,
        userId
      },
      data,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tag: true,
        createdAt: true,
        likedUser: { select: { id: true } }
      }
    })
  }

  public async deleteProduct(id: string, userId: string) {
    await prisma.product.delete({
      where: {
        id,
        userId
      }
    });
  }

  public async like(id: string, data: { likedUser: { connect: { id: string } } }) {
    await prisma.product.update({
      where: { id },
      data
    });
  }

  public async unlike(id: string, data: { likedUser: { disconnect: { id: string } } }) {
    await prisma.product.update({
      where: { id },
      data
    });
  }
}

const getLikedUser = async (id: string, userId: string) => {
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

const productRepository = new ProductRepository();
export default productRepository;
