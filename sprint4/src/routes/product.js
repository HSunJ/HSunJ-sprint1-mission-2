// import * as dotenv from 'dotenv';
import express from 'express';
import { validateProduct } from '../middlewares/validateProduct.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import auth from '../middlewares/auth.js';

import { getProducts, getProduct, createProduct, patchProduct, deleteProduct, likeProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.route('/')
    .get(auth.verifyAccessTokenOptional,
        asyncHandler(getProducts))
    .post(validateProduct, 
        auth.verifyAccessToken, 
        asyncHandler(createProduct));


productRouter.route('/:id')
    .get(auth.verifyAccessTokenOptional,
        asyncHandler(getProduct))
    .patch(auth.verifyAccessToken,
        asyncHandler(patchProduct))
    .delete(auth.verifyAccessToken,
        asyncHandler(deleteProduct))
    .post(auth.verifyAccessToken, 
        likeProduct)

export default productRouter;