import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";
import appError from "../utils/appError";
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

  public async getById(userId: string, id: string, tx?: Prisma.TransactionClient, select?: any): Promise<any> {
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
    try {
      return await (tx || prisma).product.findUniqueOrThrow({
        select: select || defaultSelect,
        where: {
          id,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new appError.NotFoundError("상품이 존재하지 않습니다");
      }
    }
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
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id },
        select: { userId: true }
      })
      if (!product) throw new appError.NotFoundError("상품이 존재하지 않습니다");
      if (product.userId !== userId) throw new appError.AuthorizationError("권한이 없습니다");

      await tx.product.delete({ where: { id } });
    })

  }

  public async like(id: string, data: { likedUser: { connect: { id: string } } }) {
    try {
      await prisma.product.update({
        where: { id },
        data
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new appError.NotFoundError("상품이 존재하지 않습니다");
      }
    }
  }

  public async unlike(id: string, data: { likedUser: { disconnect: { id: string } } }) {
    try {
      await prisma.product.update({
        where: { id },
        data
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new appError.NotFoundError("상품이 존재하지 않습니다");
      }
    }
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
