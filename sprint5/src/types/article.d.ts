import { User, Product, Article, $Enums } from "@prisma/client";

// 좋아요 여부를 나타내는 타입
type Liked = {
  isLiked: boolean;
};

// 조회한 Article
export type ArticleItem = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  likedUser?: { id: string }[];
};

// Article 에서 보여줄 정보
export type DisplayArticleItem = ArticleItem & Liked;

export type GetArticleListParams = {
  offset?: number;
  limit?: number;
  order?: string;
  keyword?: string;
};

export type ArticleCreateInput = {
  title: string;
  content: string;
};

