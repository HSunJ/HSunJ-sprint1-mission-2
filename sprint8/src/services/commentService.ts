import { Prisma } from "@prisma/client";
import commentRepository from "../repositories/commentRepository";
import {
  GetCommentListParams,
  DisplayCreateComment,
  CommentListItem,
  GetCommentListQuery,
  DisplayCommentList,
  CreateCommentInput,
} from "../types/comment";
import appError from "../utils/appError";
import notificationService from "./notificationServices";

class CommentService {
  public async getCommentList(params: GetCommentListParams, type: 'product' | 'article') {
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
    const comments: CommentListItem[] = await commentRepository.getList(query, type);

    if (!comments) {
      throw new appError.NotFoundError("댓글이 존재하지 않습니다");
    }

    let nextCursor = null;
    if (comments.length === take) {
      nextCursor = comments[comments.length - 1].id;
    }

    const displayCommentList = {
      data: comments,
      nextCursor,
      hasMore: comments.length === take,
    }
    return displayCommentList;
  }

  public async createProductComment(input: CreateCommentInput, userId: string) {
    const comment = await commentRepository.saveComment(input, userId, 'product');
    const displayComment = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      userId: comment.userId,
    };
    return displayComment;
  }

  public async createArticleComment(input: CreateCommentInput, userId: string) {
    const comment = await commentRepository.saveComment(input, userId, 'article') as unknown as { id: string, content: string, createdAt: Date, userId: string, article: { userId: string } };
    const targetId = comment.article.userId;
    const commentNotification = {
      relatedId: comment.id,
      userId: targetId
    };
    await notificationService.createArticleCommentNotification(commentNotification);

    const displayComment = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      userId: comment.userId,
    };

    return displayComment;
  }

  public async patchProductComment(id: string, userId: string, input: Partial<CreateCommentInput>) {
    const updatedComment = await commentRepository.updateComment(id, userId, input, 'product');
    const displayComment = {
      id: updatedComment.id,
      content: updatedComment.content,
      createdAt: updatedComment.createdAt,
      userId: updatedComment.userId,
    };
    return displayComment;
  }

  public async patchArticleComment(id: string, userId: string, input: Partial<CreateCommentInput>): Promise<DisplayCreateComment> {
    const updatedComment = await commentRepository.updateComment(id, userId, input, 'article');
    const displayComment = {
      id: updatedComment.id,
      content: updatedComment.content,
      createdAt: updatedComment.createdAt,
      userId: updatedComment.userId,
    };
    return displayComment;
  }

  public async deleteProductComment(id: string, userId: string): Promise<void> {
    await commentRepository.deleteById(id, userId, 'product');
  }

  public async deleteArticleComment(id: string, userId: string): Promise<void> {
    await commentRepository.deleteById(id, userId, 'article');
  }
}
const commentService = new CommentService();
export default commentService;