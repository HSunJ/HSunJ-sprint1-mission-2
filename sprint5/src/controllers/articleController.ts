import { PrismaClient } from "@prisma/client";
import { PatchArticle } from '../structs.js';
import { assert } from "superstruct";
import { RequestHandler } from "express";

import appError from "../utils/appError";
import articleRepository from "../repositories/articleRepository";
import { ArticleListItem, DisplayArticleListItem, ArticleDetail, DisplayArticleDetail } from "../types/article.d";

const prisma = new PrismaClient();

export const getArticles: RequestHandler = async (req, res) => {
  const { offset = 0, limit = 10, order, keyword = "" } = req.query;
  const userId = req.user?.userId;

  const articles: ArticleListItem[] = await articleRepository.getList(userId, {
    keyword: keyword as string,
    order: order as string,
    offset: Number(offset),
    limit: Number(limit)
  });

  if (!articles) {
    throw new appError.NotFoundError("게시글이 존재하지 않습니다");
  }

  const displayArticleList: DisplayArticleListItem[] = articles.map((article) => {
    return {
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt,
      isLiked: article.likedUser ? article.likedUser.length > 0 : false
    }
  });
  res.status(200).send(displayArticleList);
};

export const getArticle: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const article: ArticleDetail = await articleRepository.getById(userId, id);
  if (!article) {
    throw new appError.NotFoundError("게시글이 존재하지 않습니다");
  }

  const displayArticleData: DisplayArticleDetail = {
    id: article.id,
    title: article.title,
    content: article.content,
    createdAt: article.createdAt,
    isLiked: article.likedUser ? article.likedUser.length > 0 : false
  };

  res.status(200).send(displayArticleData);
};

export const createArticle: RequestHandler = async (req, res) => {
  const userId = req.user?.userId;
  const article = await articleRepository.createArticle(req.body, userId);
  res.status(201).send(article);
};

export const patchArticle: RequestHandler = async (req, res) => {
  assert(req.body, PatchArticle);
  const { id } = req.params;
  const userId = req.user?.userId;
  const article = await articleRepository.patchArticle(id, userId, req.body);
  if (!article) {
    throw new appError.NotFoundError("게시글이 존재하지 않습니다");
  }
  res.status(202).send(article);
};

export const deleteArticle: RequestHandler = async (req, res) => {
  const { id } = req.params;
  await prisma.article.delete({
    where: { id },
  });
  res.sendStatus(204);
};

export const likeArticle: RequestHandler = async (req, res) => {
  const userId = req.user.userId;
  const id = req.params.id;
  const article = await prisma.article.findUnique({
    where: {
      id
    },
    select: {
      likedUser: {
        where: { id: userId },
        select: { id: true }
      }
    }
  })

  if (!article) {
    const error = new Error("상품이 존재하지 않습니다");
    error.status = 404;
    throw error;
  }

  if (article.likedUser.length > 0) {
    // 좋아요 해제
    await prisma.article.update({
      where: { id },
      data: {
        likedUser: { disconnect: { id: userId } }
      }
    });
    res.status(201).json({ message: "좋아요가 취소되었습니다." });
  }
  else {
    await prisma.article.update({
      where: { id },
      data: { likedUser: { connect: { id: userId } } }
    });
    res.status(201).json({ message: "좋아요를 눌렀습니다" });
  }
}