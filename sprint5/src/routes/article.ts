// import * as dotenv from 'dotenv';
import express from 'express';

import { validateArticle } from '../middlewares/validateArticle';
import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from '../controllers/articleController.js';
import auth from '../middlewares/auth.js';
import { asyncHandler } from '../middlewares/asyncHandler';

const articleRouter = express.Router();

articleRouter.route('/')
    .get(auth.verifyAccessTokenOptional,
        asyncHandler(getArticleList))
    .post(validateArticle,
        auth.verifyAccessToken,
        asyncHandler(createArticle));

articleRouter.route('/:id')
    .get(auth.verifyAccessTokenOptional,
        asyncHandler(getArticle))
    .patch(auth.verifyAccessToken,
        asyncHandler(patchArticle))
    .delete(auth.verifyAccessToken,
        asyncHandler(deleteArticle));

export default articleRouter;