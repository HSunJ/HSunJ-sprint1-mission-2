import { Prisma } from '@prisma/client';

// ========================댓글 조회 타입=========================
export type CommentListItem = {
  id: string;
  content: string;
  createdAt: Date;
}

export type DisplayCommentList = {
  data: CommentListItem[];
  nextCursor: string | null;
  hasMore: boolean;
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
  productId?: string;
  articleId?: string;
}

export type DisplayCreateComment = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
}
// ============================================================
