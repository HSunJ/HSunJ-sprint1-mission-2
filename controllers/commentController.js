import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";

const prisma = new PrismaClient();

export const getProductComments = async (req, res) => {
    const { cursor, limit = 5, order = 'recent' } = req.query;

    const orderBy = order === 'recent' ? { createdAt: "desc" } : { createdAt: "asc" };
    const query = {
        select: {
            id: true,
            content: true,
            createdAt: true
        },
        take: limit,
        orderBy
    }
    if (cursor) {
        query.cursor = { id: cursor };
        query.skip = 1;
    }

    const coments = await prisma.productComent.findMany(query);

    let nextCursor = null;
    if (coments.length === limit) {
        nextCursor = coments[coments.length - 1].id;
    }

    res.status(200).json({
        data: coments,
        nextCursor,
        hasMore: commentRouter.length === limit
    });
};

export const createProductComment = async (req, res) => {
    const comment = await prisma.productComent.create({ data: req.body });
    res.status(201).send(comment);
};

export const patchProductComment = async (req, res) => {
    const { id } = req.params;
    const comment = await prisma.productComent.update({
        where: { id },
        data: req.body
    });
    res.status(202).send(comment);
};

export const deleteProductComment = async (req, res) => {
    const { id } = req.params;
    await prisma.productComent.delete({
        where: { id }
    })
    res.sendStatus(204);
};


export const getArticleComments = async (req, res) => {
    const { cursor, limit = 5, order = 'recent' } = req.query;

    const orderBy = order === 'recent' ? { createdAt: "desc" } : { createdAt: "asc" };
    const query = {
        select: {
            id: true,
            content: true,
            createdAt: true
        },
        take: limit,
        orderBy
    }
    if (cursor) {
        query.cursor = { id: cursor };
        query.skip = 1;
    }

    const coments = await prisma.articleComent.findMany(query);

    let nextCursor = null;
    if (coments.length === limit) {
        nextCursor = coments[coments.length - 1].id;
    }

    res.status(200).json({
        data: coments,
        nextCursor,
        hasMore: commentRouter.length === limit
    });
};

export const createArticleComment = async (req, res) => {
    const comment = await prisma.articleComent.create({ data: req.body });
    res.status(201).send(comment);
};

export const patchArticleComment = async (req, res) => {
    const { id } = req.params;
    const comment = await prisma.articleComent.update({
        where: { id },
        data: req.body
    });
    res.status(202).send(comment);
};

export const deleteArticleComment = async (req, res) => {
    const { id } = req.params;
    await prisma.articleComent.delete({
        where: { id }
    })
    res.sendStatus(204);
};