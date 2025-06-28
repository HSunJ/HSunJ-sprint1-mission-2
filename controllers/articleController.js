import { PrismaClient } from "@prisma/client";
import { PatchArticle } from '../structs.js';
import { assert } from "superstruct";

const prisma = PrismaClient();

export const getArticles = async (req, res) => {
    const { offset = 0, limit = 10, order, keyword = "" } = req.query;
    const orderBy = order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };
    const articles = await prisma.article.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true
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
    res.status(200).send(articles);
};

export const getArticle = async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUniqueOrThrow({
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true
        },
        where: { id },
    });
    res.status(200).send(article);
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