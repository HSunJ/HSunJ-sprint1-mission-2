import express from 'express';
import { getProductComments, createProductComment, patchProductComment, deleteProductComment, getArticleComments, createArticleComment, patchArticleComment, deleteArticleComment } from '../controllers/commentController.js';
import auth from '../middlewares/auth.js';

const commentRouter = express.Router();

commentRouter.route('/products')
    .get(getProductComments)
    .post(auth.verifyAccessToken,
        createProductComment);

commentRouter.route('/products/:id')
    .patch(auth.verifyAccessToken,
        patchProductComment)
    .delete(auth.verifyAccessToken,
        deleteProductComment);

    
commentRouter.route('/articles')
    .get(getArticleComments)
    .post(auth.verifyAccessToken,
        createArticleComment);

commentRouter.route('/articles/:id')
    .patch(auth.verifyAccessToken,
        patchArticleComment)
    .delete(auth.verifyAccessToken,
        deleteArticleComment);

export default commentRouter