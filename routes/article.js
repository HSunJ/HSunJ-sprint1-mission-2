// import * as dotenv from 'dotenv';
import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { assert, create, omit } from 'superstruct';
import { PatchArticle } from '../structs.js';
import { validateArticle } from '../middlewares/validateArticle.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';


const prisma = new PrismaClient();
const articleRouter = express.Router();

articleRouter.route('/')
    .get(asyncHandler(async (req, res) => {
        const { offset = 0, limit = 10, order, keyword="" } = req.query;
        let orderBy = order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };
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
    }))
    .post(validateArticle, asyncHandler(async (req, res) => {
        const article = await prisma.article.create({
            data: req.body,
        });
        res.status(201).send(article);
    }))

articleRouter.route('/:id')
    .get(asyncHandler(async (req, res) => {
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
    }))
    .patch(asyncHandler(async (req, res) => {
        assert(req.body, PatchArticle);
        const { id } = req.params;
        const article = await prisma.article.update({
            where: { id },
            data: req.body,
        });
        res.status(202).send(article);
    }))
    .delete(asyncHandler(async (req, res) => {
        const { id } = req.params;
        await prisma.article.delete({
            where: { id },
        });
        res.sendStatus(204);
    }));

export default articleRouter;