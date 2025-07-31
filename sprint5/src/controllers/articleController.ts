import { PrismaClient } from "@prisma/client";
import { PatchArticle } from '../structs.js';
import { assert } from "superstruct";

const prisma = new PrismaClient();

export const getArticles = async (req, res) => {
  const { offset = 0, limit = 10, order, keyword = "" } = req.query;
  const orderBy = order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };
  const userId = req.user?.userId;

  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      likedUser: userId ? { where: { id: userId } } : false
    },
    where: {
      OR: [
        { title: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } }
      ]
    },
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
  });
  const articleList = articles.map((article) => {
    return {
      id: article.id,
      name: article.name,
      price: article.price,
      createdAt: article.createdAt,
      isLiked: article.likedUser?.length > 0 ? true : false
    }
  });
  res.status(200).send(articleList);
};

export const getArticle = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const article = await prisma.article.findUniqueOrThrow({
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      likedUser: userId ? {
        where: { id: userId },
        select: { id: true }
      } : false,
      createdAt: true
    },
    where: { id },
  });
  
  article.isLiked = false;
  if (article.likedUser?.length > 0) {
    article.isLiked = true;
  }
  const { likedUser, ...articleData } = article;

  res.status(200).send(articleData);
};

export const createArticle = async (req, res) => {
  const article = await prisma.article.create({
    data: req.body,
  });
  res.status(201).send(article);
};

export const patchArticle = async (req, res) => {
  assert(req.body, PatchArticle);
  const { id } = req.params;
  const article = await prisma.article.update({
    where: { id },
    data: req.body,
  });
  res.status(202).send(article);
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;
  await prisma.article.delete({
    where: { id },
  });
  res.sendStatus(204);
};

export const likeArticle = async (req, res) => {
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