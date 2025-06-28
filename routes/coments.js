import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { getProductComments, createProductComment, patchProductComment, deleteProductComment, getArticleComments, createArticleComment, patchArticleComment, deleteArticleComment } from '../controllers/commentController.js';
const prisma = new PrismaClient();

const commentRouter = express.Router();

commentRouter.route('/products')
    .get(asyncHandler(getProductComments))
    .post(asyncHandler(createProductComment));

commentRouter.route('/products/:id')
    .patch(asyncHandler(patchProductComment))
    .delete(asyncHandler(deleteProductComment));

    
commentRouter.route('/articles')
    .get(asyncHandler(getArticleComments))
    .post(asyncHandler(createArticleComment));

commentRouter.route('/articles/:id')
    .patch(asyncHandler(patchArticleComment))
    .delete(asyncHandler(deleteArticleComment));

export default commentRouter