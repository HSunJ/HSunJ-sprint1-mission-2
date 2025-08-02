import { Prisma } from '@prisma/client';

import prisma from '../config/prisma.js';
import {
  GetCommentListQuery,
  GetCommentListParams,
  CreateProductCommentInput,
  CreateArticleCommentInput,
  DisplayCreateComment
} from '../types/comment.d';


export const saveProductComment = async (input: CreateProductCommentInput, userId: string): Promise<DisplayCreateComment> => {
  const createdComment = await prisma.productComment.create({
    data: {
      content: input.content,
      user: {
        connect: { id: userId },
      },
      product: {
        connect: { id: input.productId },
      },
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      userId: true,
    },
  });
  return createdComment;
};

export const saveArticleComment = async (input: CreateArticleCommentInput, userId: string): Promise<DisplayCreateComment> => {
  const createdComment = await prisma.articleComment.create({
    data: {
      content: input.content,
      user: {
        connect: { id: userId },
      },
      article: {
        connect: { id: input.articleId },
      },
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      userId: true,
    },
  });
  return createdComment;
};

const getList = async (params: GetCommentListParams, type: 'product' | 'article') => {
  const take = params.limit || 5;
  const orderBy: Prisma.ProductOrderByWithRelationInput = params.order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };
  const query: GetCommentListQuery = {
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    take,
    orderBy,
  };
  if (params.cursor) {
    query.cursor = { id: params.cursor };
    query.skip = 1;
  }
  return type === 'product' ?
    await prisma.productComment.findMany(query) :
    await prisma.articleComment.findMany(query);

}

const updateProductComment = async (productId: string, userId: string, input: Partial<CreateProductCommentInput>): Promise<DisplayCreateComment> => {
  const updatedComment = await prisma.productComment.update({
    where: {
      id: productId,
      userId: userId,
    },
    data: {
      content: input.content,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      userId: true,
    },
  });
  return updatedComment;
};

const updateArticleComment = async (articleId: string, userId: string, input: Partial<CreateArticleCommentInput>): Promise<DisplayCreateComment> => {
  const updatedComment = await prisma.articleComment.update({
    where: {
      id: articleId,
      userId: userId,
    },
    data: {
      content: input.content,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      userId: true,
    },
  });
  return updatedComment;
};

async function deleteById(id: string, userId: string, type: 'product' | 'article'): Promise<DisplayCreateComment> {
  const deletedComment = type === 'product' ?
    await prisma.productComment.delete({ where: { id, userId } }) :
    await prisma.articleComment.delete({ where: { id, userId } });
  return deletedComment;
}

export default {
  saveProductComment,
  saveArticleComment,
  getList,
  updateProductComment,
  updateArticleComment,
  deleteById,
};