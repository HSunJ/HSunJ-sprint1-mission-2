import { User, Product, Article, $Enums } from "@prisma/client";

// 좋아요 여부를 나타내는 타입
type Liked = {
  isLiked: boolean;
};

// 조회한 Article 리스트
export type ArticleListItem = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  likedUser?: { id: string }[];
};

// Article List에서 보여줄 기사 정보
export type DisplayArticleListItem = ArticleListItem & Liked;

export type GetArticleListParams = {
  offset?: number;
  limit?: number;
  order?: string;
  keyword?: string;
};

// Article 상세 조회 타입
export type ArticleDetail = {
  id: string;
  title: string;
  content: string | null;
  createdAt: Date;
  likedUser?: { id: string }[];
};

// Product 상세 조회 시 보여줄 상품 정보 타입
export type DisplayArticleDetail = ArticleDetail & Liked;

export type ArticleCreateInput = {
  title: string;
  content: string;
};
// User가 생성한 기사 목록에서 보여줄 기사 정보 타입
export type DisplayCreateArticle = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};
