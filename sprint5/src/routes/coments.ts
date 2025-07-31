import express from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import { getProductComments, createProductComment, patchProductComment, deleteProductComment, getArticleComments, createArticleComment, patchArticleComment, deleteArticleComment } from '../controllers/commentController.js';
import auth from '../middlewares/auth.js';

const commentRouter = express.Router();

commentRouter.route('/products')
    .get(asyncHandler(getProductComments))
    .post(auth.verifyAccessToken,
        asyncHandler(createProductComment));

commentRouter.route('/products/:id')
    .patch(auth.verifyAccessToken,
        asyncHandler(patchProductComment))
    .delete(auth.verifyAccessToken,
        asyncHandler(deleteProductComment));

    
commentRouter.route('/articles')
    .get(asyncHandler(getArticleComments))
    .post(auth.verifyAccessToken,
        asyncHandler(createArticleComment));

commentRouter.route('/articles/:id')
    .patch(auth.verifyAccessToken,
        asyncHandler(patchArticleComment))
    .delete(auth.verifyAccessToken,
        asyncHandler(deleteArticleComment));

export default commentRouter