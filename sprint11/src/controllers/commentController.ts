import { RequestHandler } from "express";

import commentService from "../services/commentService";
import appError from "../utils/appError";

export const getProductComments: RequestHandler = async (req, res) => {
    const { cursor, limit = 5, order = 'recent' } = req.query;

    const comments = await commentService.getCommentList({
        limit: Number(limit),
        order: order as string,
        cursor: cursor as string | undefined
    }, 'product');

    res.status(200).json(comments);
};

export const createProductComment: RequestHandler = async (req, res) => {
    const userId = req.user?.userId;
    const comment = await commentService.createProductComment(req.body, userId as string);
    res.status(201).send(comment);
};

export const patchProductComment: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const comment = await commentService.patchProductComment(id, userId as string, req.body);
    if (!comment) {
        throw new appError.NotFoundError("댓글이 존재하지 않습니다");
    }
    res.status(202).send(comment);
};

export const deleteProductComment: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    await commentService.deleteProductComment(id, userId as string);
    res.status(204).send({ message: "댓글이 삭제되었습니다" });
};


export const getArticleComments: RequestHandler = async (req, res) => {
    const { cursor, limit = 5, order = 'recent' } = req.query;

    const comments = await commentService.getCommentList({
        limit: Number(limit),
        order: order as string,
        cursor: cursor as string | undefined
    }, 'article');

    res.status(200).json(comments);
};

export const createArticleComment: RequestHandler = async (req, res) => {
    const userId = req.user?.userId;
    const comment = await commentService.createArticleComment(req.body, userId as string);
    res.status(201).send(comment);
};

export const patchArticleComment: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const comment = await commentService.patchArticleComment(id, userId as string, req.body);
    if (!comment) {
        throw new appError.NotFoundError("댓글이 존재하지 않습니다");
    }
    res.status(202).send(comment);
};

export const deleteArticleComment: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    await commentService.deleteArticleComment(id, userId as string);
    res.status(204).send({ message: "댓글이 삭제되었습니다" });
};