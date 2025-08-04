import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

import { GetProductListParams, ProductListItem, ProductDetail, ProductCreateInput, DisplayCreateProduct } from "../types/product.d";

class ProductRepository {
  public async getList(userId: string | undefined,
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

  public async getById(userId: string | undefined, id: string): Promise<ProductDetail> {
    return await prisma.product.findUniqueOrThrow({
      select: {
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
      },
      where: {
        id,
      },
    });
  }

  public async getLiked(userId: string | undefined, id: string): Promise<{ likedUser: { id: string }[] } | null> {
    return await prisma.product.findUnique({
      select: {
        likedUser: { where: { id: userId }, select: { id: true } }
      },
      where: { id },
    });
  }

  public async createProduct(input: ProductCreateInput, userId: string | undefined): Promise<DisplayCreateProduct> {
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

  public async patchProduct(id: string, userId: string | undefined, data: Partial<ProductCreateInput>): Promise<ProductDetail> {
    return await prisma.product.update({
      where: {
        id,
        userId
      },
      data
    })
  }

  public async deleteProduct(id: string, userId: string | undefined): Promise<void> {
    await prisma.product.delete({
      where: {
        id,
        userId
      }
    });
  }

  public async like(id: string, data: { likedUser: { connect: { id: string | undefined } } }): Promise<void> {
    await prisma.product.update({
      where: { id },
      data
    });
  }

  public async unlike(id: string, data: { likedUser: { disconnect: { id: string | undefined } } }): Promise<void> {
    await prisma.product.update({
      where: { id },
      data
    });
  }
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

const productRepository = new ProductRepository();
export default productRepository;
