import { PrismaClient } from "@prisma/client";
import { PatchArticle } from '../structs';
import { assert } from "superstruct";
import { RequestHandler } from "express";

import appError from "../utils/appError";
import articleRepository from "../repositories/articleRepository";
import articleService from "../services/articleService";

const prisma = new PrismaClient();

export const getArticleList: RequestHandler = async (req, res) => {
  const { offset = 0, limit = 10, order, keyword = "" } = req.query;
  const userId = req.user?.userId;

  const articleList = await articleService.getArticleList(userId, {
    keyword: keyword as string,
    order: order as string,
    offset: Number(offset),
    limit: Number(limit)
  });

  res.status(200).send(articleList);
};

export const getArticle: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const article = await articleService.getArticle(userId, id);

  res.status(200).send(article);
};

export const createArticle: RequestHandler = async (req, res) => {
  const userId = req.user?.userId;
  const article = await articleService.saveArticle(userId, req.body);
  res.status(201).send(article);
};

export const patchArticle: RequestHandler = async (req, res) => {
  assert(req.body, PatchArticle);
  const { id } = req.params;
  const userId = req.user?.userId;

  const article = await articleRepository.patchArticle(userId, id, req.body);
  res.status(202).send(article);
};

export const deleteArticle: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  await articleService.deleteArticle(userId, id);
  res.status(204).send({ message: "게시글이 삭제되었습니다" });
};

export const likeArticle: RequestHandler = async (req, res) => {
  const userId = req.user?.userId;
  const id = req.params.id;

  if (await articleService.isLiked(userId, id)) {
    await articleService.unlikeArticle(userId, id);
    res.status(201).json({ message: "좋아요가 취소되었습니다." });
  }
  else {
    await articleService.likeArticle(userId, id);
    res.status(201).json({ message: "좋아요를 눌렀습니다" });
  }
}