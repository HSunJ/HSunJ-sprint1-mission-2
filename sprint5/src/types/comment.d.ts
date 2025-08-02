import { Prisma } from '@prisma/client';

// ========================댓글 조회 타입=========================
export type CommentListItem = {
  id: string;
  content: string;
  createdAt: Date;
}

export type GetCommentListParams = {
  limit?: number;
  order?: string;
  cursor?: string | undefined;
}

export type GetCommentListQuery = {
  select: {
    id: true;
    content: true;
    createdAt: true;
  };
  take: number;
  orderBy: Prisma.ProductOrderByWithRelationInput;
  cursor?: { id: string };
  skip?: number;
}
// ============================================================

// ========================댓글 생성 타입=========================
export type CreateCommentInput = {
  content: string;
  userId: string;
}

export type CreateProductCommentInput = CreateCommentInput & {
  productId: string;
}

export type CreateArticleCommentInput = CreateCommentInput & {
  articleId: string;
}

export type DisplayCreateComment = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
}
// ============================================================
