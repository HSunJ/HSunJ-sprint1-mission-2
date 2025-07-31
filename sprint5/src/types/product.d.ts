import { User, Product, Article, $Enums } from "@prisma/client";

// 좋아요 여부를 나타내는 타입
type Liked = {
  isLiked: boolean;
};

// 조회한 Product 리스트
export type ProductListItem = {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
  likedUser?: { id: string }[];
};

// Product List에서 보여줄 상품 정보
export type DisplayProductListItem = ProductListItem & Liked;

export type GetProductListParams = {
  offset?: number;
  limit?: number;
  order?: string;
  keyword?: string;
};

// Product 상세 조회 타입
export type ProductDetail = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  tag: $Enums.Tags | null;
  createdAt: Date;
  likedUser?: { id: string }[];
};

// Product 상세 조회 시 보여줄 상품 정보 타입
export type DisplayProductDetail = ProductDetail & Liked;

export type ProductCreateInput = {
  name: string;
  description?: string | null;
  price: number;
  tag?: $Enums.Tags | null;
};
// User가 생성한 상품 목록에서 보여줄 상품 정보 타입
export type DisplayCreateProduct = {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
};
