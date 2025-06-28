import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const prisma = new PrismaClient();

const commentRouter = express.Router();

commentRouter.route('/products')
    .get(asyncHandler(async (req, res) => {
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
    }))
    .post(asyncHandler(async (req, res) => {
        const comment = await prisma.productComent.create({ data: req.body });
        res.status(201).send(comment);
    }));
    

commentRouter.route('/products/:id')
    .patch(asyncHandler(async (req, res) => {
        const { id } = req.params;
        const comment = await prisma.productComent.update({
            where: {id},
            data: req.body
        });
        res.status(202).send(comment);
    }))
    .delete(asyncHandler(async (req, res) => {
        const {id} = req.params;
        await prisma.productComent.delete({
            where: {id}
        })
        res.sendStatus(204);
    }))

commentRouter.route('/articles')
    .get(asyncHandler(async (req, res) => {
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
    }))
    .post(asyncHandler(async (req, res) => {
        const comment = await prisma.articleComent.create({ data: req.body });
        res.status(201).send(comment);
    }));

commentRouter.route('/articles/:id')
    .patch(asyncHandler(async (req, res) => {
        const { id } = req.params;
        const comment = await prisma.articleComent.update({
            where: {id},
            data: req.body
        });
        res.status(202).send(comment);
    }))
    .delete(asyncHandler(async (req, res) => {
        const {id} = req.params;
        await prisma.articleComent.delete({
            where: {id}
        })
        res.sendStatus(204);
    }))

export default commentRouter