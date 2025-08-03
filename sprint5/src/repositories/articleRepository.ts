import { Prisma } from "@prisma/client";

import { GetArticleListParams, ArticleItem, ArticleCreateInput } from "../types/article"
import prisma from "../config/prisma";

class ArticleRepository {
  public async getList(userId: string | undefined,
    { keyword, order, offset, limit }: GetArticleListParams): Promise<ArticleItem[]> {
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

  public async getById(userId: string | undefined, id: string): Promise<ArticleItem> {
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

  public async getLiked(userId: string | undefined, id: string): Promise<{ likedUser: { id: string }[] } | null> {
    return await prisma.article.findUnique({
      select: {
        likedUser: { where: { id: userId }, select: { id: true } }
      },
      where: { id },
    });
  }

  public async createArticle(userId: string | undefined, input: ArticleCreateInput): Promise<ArticleItem> {
    return await prisma.article.create({
      data: {
        ...input,
        author: { connect: { id: userId } }
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true
      }
    });
  }

  public async patchArticle(userId: string | undefined, id: string, data: Partial<ArticleCreateInput>): Promise<ArticleItem> {
    return await prisma.article.update({
      where: {
        id,
        userId
      },
      data
    });
  }

  public async deleteArticle(userId: string | undefined, id: string): Promise<void> {
    await prisma.article.delete({
      where: {
        id,
        userId
      }
    });
  }

  public async like(id: string, data: { likedUser: { connect: { id: string | undefined } } }): Promise<void> {
    await prisma.article.update({
      where: { id },
      data
    });
  }

  public async unlike(id: string, data: { likedUser: { disconnect: { id: string | undefined } } }): Promise<void> {
    await prisma.article.update({
      where: { id },
      data
    });
  }
}

const articleRepository = new ArticleRepository();
export default articleRepository;