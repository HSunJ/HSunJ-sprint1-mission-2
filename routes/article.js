// import * as dotenv from 'dotenv';
import express from 'express';
import { validateArticle } from '../middlewares/validateArticle.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { getArticles, getArticle, createArticle, patchArticle, deleteArticle } from '../controllers/articleController.js';

const articleRouter = express.Router();

articleRouter.route('/')
    .get(asyncHandler(getArticles))
    .post(validateArticle, asyncHandler(createArticle));

articleRouter.route('/:id')
    .get(asyncHandler(getArticle))
    .patch(asyncHandler(patchArticle))
    .delete(asyncHandler(deleteArticle));

export default articleRouter;