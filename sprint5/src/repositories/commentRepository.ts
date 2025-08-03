import prisma from '../config/prisma.js';
import {
  GetCommentListQuery,
  CreateCommentInput,
  DisplayCreateComment
} from '../types/comment.d';

class CommentRepository {
  public async getList(query: GetCommentListQuery, type: 'product' | 'article') {
    return type === 'product' ?
      await prisma.productComment.findMany(query) :
      await prisma.articleComment.findMany(query);
  }

  public async saveComment(input: CreateCommentInput, userId: string, type: 'product' | 'article'): Promise<DisplayCreateComment> {
    const createdComment = type === 'product' ?
      await prisma.productComment.create({
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
      }) :
      await prisma.articleComment.create({
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

  public async updateComment(id: string, userId: string, input: Partial<CreateCommentInput>, type: 'product' | 'article'): Promise<DisplayCreateComment> {
    const updatedComment = type === 'product' ?
      await prisma.productComment.update({
        where: { id, userId },
        data: input,
        select: {
          id: true,
          content: true,
          createdAt: true,
          userId: true,
        },
      }) :
      await prisma.articleComment.update({
        where: { id, userId },
        data: input,
        select: {
          id: true,
          content: true,
          createdAt: true,
          userId: true,
        },
      });
    return updatedComment;
  };

  public async deleteById(id: string, userId: string, type: 'product' | 'article'): Promise<DisplayCreateComment> {
    const deletedComment = type === 'product' ?
      await prisma.productComment.delete({ where: { id, userId } }) :
      await prisma.articleComment.delete({ where: { id, userId } });
    return deletedComment;
  }
};

async function deleteById(id: string, userId: string, type: 'product' | 'article'): Promise<DisplayCreateComment> {
  const deletedComment = type === 'product' ?
    await prisma.productComment.delete({ where: { id, userId } }) :
    await prisma.articleComment.delete({ where: { id, userId } });
  return deletedComment;
}

const commentRepository = new CommentRepository();
export default commentRepository;