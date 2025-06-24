import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const articleRouter = express.Router();

const comentRouter = express.Router();

comentRouter.route('/product')
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