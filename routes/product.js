// import * as dotenv from 'dotenv';
import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { assert, create } from 'superstruct';
import { PatchProduct } from '../structs.js';
import { validateProduct } from '../middlewares/validateProduct.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';


const prisma = new PrismaClient();
const productRouter = express.Router();

productRouter.route('/')
    .get(asyncHandler(async (req, res) => {
        const { offset = 0, limit = 10, order = "recent", keyword = "" } = req.query;
        let orderBy = order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };

        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                createdAt: true
            },
            where: {
                OR: [
                    { name: { contains: keyword, mode: 'insensitive' } },
                    { description: { contains: keyword, mode: 'insensitive' } }
                ]
            },
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
        });
        res.status(200).send(products);
    }))
    .post(validateProduct, asyncHandler(async (req, res) => {
        const product = await prisma.product.create({
            data: req.body,
        });
        res.status(201).send(product);
    }));


productRouter.route('/:id')
    .get(asyncHandler(async (req, res) => {
        const { id } = req.params;
        const product = await prisma.product.findUniqueOrThrow({
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                tags: true,
                createdAt: true
            },
            where: { id },
        });
        res.status(200).send(product);
    }))
    .patch(asyncHandler(async (req, res) => {
        assert(req.body, PatchProduct);
        const { id } = req.params;
        const product = await prisma.product.update({
            where: { id },
            data: req.body,
        });
        res.status(202).send(product);
    }))
    .delete(asyncHandler(async (req, res) => {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id },
        });
        res.sendStatus(204);
    }));

productRouter.route('/coments')
    .post(asyncHandler(async (req, res) => {
        const coment = await prisma.productComent.create({
            data: req.body
        })
        res.status(201).send(coment);
    }))
    .get(asyncHandler(async (req, res) => {
        const { cursor, limit = 5 } = req.query;
        const query = {};
        if (cursor) {
            qurey = {
                select: {
                    id: true,
                    content: true,
                    createdAt: true
                },
                skip: 1,
                cursor: { id: parseInt(cursor) },
                orderBy: { id: 'asc' },
                take: parseInt(limit),
            }
        } else {
            query = {
                select: {
                    id: true,
                    content: true,
                    createdAt: true
                },
                skip: 0,
                orderBy: { id: 'asc' },
                take: parseInt(limit),
            }
        }

        const coments = await prisma.productComent.findMany(query);

        let nextCursor = null;
        if (coments.length) {
            nextCursor = coments[coments.length - 1].id;
        }

        res.status(200).json({
            data: coments,
            nextCursor
        });
    }));

export default productRouter;