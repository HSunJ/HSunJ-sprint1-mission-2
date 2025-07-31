import { Prisma } from "@prisma/client";

import { GetArticleListParams, ArticleListItem, ArticleDetail, ArticleCreateInput, DisplayCreateArticle } from "../types/article"
import prisma from "../config/prisma";

const getList = async (userId: string | undefined,
  { keyword, order, offset, limit }: GetArticleListParams): Promise<ArticleListItem[]> => {
  const orderBy: Prisma.ArticleOrderByWithRelationInput = order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };
  return await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      likedUser: userId ? { where: { id: userId } } : false
    },
    where: {
      OR: [
        { title: { contains: keyword as string, mode: 'insensitive' } },
        { content: { contains: keyword as string, mode: 'insensitive' } }
      ]
    },
    orderBy,
    skip: Number(offset),
    take: Number(limit),
  });
}

const getById = async (userId: string | undefined, id: string): Promise<ArticleDetail> => {
  return await prisma.article.findUniqueOrThrow({
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      likedUser: userId ? {
        where: { id: userId },
        select: { id: true }
      } : false,
    },
    where: { id },
  });
}

const createArticle = async (articleInput: ArticleCreateInput, userId: string | undefined): Promise<DisplayCreateArticle> => {
  return await prisma.article.create({
    data: {
      ...articleInput,
      author: { connect: { id: userId } }
    },
    select:{
      id: true,
      title: true,
      content: true,
      createdAt: true
    }
  });
}

const patchArticle = async (id: string, userId: string | undefined, data: Partial<ArticleCreateInput>) => {
  return await prisma.article.update({
    where:{
      id,
      userId
    },
    data
  });
}

export default {
  getList,
  getById,
  createArticle,
  patchArticle,
}