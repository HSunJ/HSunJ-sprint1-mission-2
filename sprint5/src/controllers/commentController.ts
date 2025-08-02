import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { assert } from "superstruct";

const prisma = new PrismaClient();

import commentRepository from "../repositories/commentRepository";
import appError from "../utils/appError";

export const getProductComments: RequestHandler = async (req, res) => {
    const { cursor, limit = 5, order = 'recent' } = req.query;

    const coments = await commentRepository.getList({
        limit: Number(limit),
        order: order as string,
        cursor: cursor as string | undefined
    }, 'product');

    let nextCursor = null;
    if (coments.length === limit) {
        nextCursor = coments[coments.length - 1].id;
    }

    res.status(200).json({
        data: coments,
        nextCursor,
        hasMore: coments.length === limit
    });
};

export const createProductComment: RequestHandler = async (req, res) => {
    const userId = req.user?.userId;
    const comment = await commentRepository.saveProductComment(req.body, userId as string);
    res.status(201).send(comment);
};

export const patchProductComment: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const comment = await commentRepository.updateProductComment(id, userId as string, req.body);
    if (!comment) {
        throw new appError.NotFoundError("댓글이 존재하지 않습니다");
    }
};

export const deleteProductComment: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    await commentRepository.deleteById(id, userId as string, 'product');
    res.status(204).send({ message: "댓글이 삭제되었습니다" });
};


export const getArticleComments: RequestHandler = async (req, res) => {
    const { cursor, limit = 5, order = 'recent' } = req.query;

    const coments = await commentRepository.getList({
        limit: Number(limit),
        order: order as string,
        cursor: cursor as string | undefined
    }, 'article');

    let nextCursor = null;
    if (coments.length === limit) {
        nextCursor = coments[coments.length - 1].id;
    }

    res.status(200).json({
        data: coments,
        nextCursor,
        hasMore: coments.length === limit
    });
};

export const createArticleComment: RequestHandler = async (req, res) => {
    const userId = req.user?.userId;
    const comment = await commentRepository.saveArticleComment(req.body, userId as string);
    res.status(201).send(comment);
};

export const patchArticleComment: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const comment = await commentRepository.updateArticleComment(id, userId as string, req.body);
    res.status(202).send(comment);
};

export const deleteArticleComment: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    await commentRepository.deleteById(id, userId as string, 'article');
    res.status(204).send({ message: "댓글이 삭제되었습니다" });
};