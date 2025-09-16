import express from 'express';

import { validateProduct } from '../middlewares/validateProduct';
import auth from '../middlewares/auth';
import { getProductList, getProduct, createProduct, patchProduct, deleteProduct, likeProduct } from '../controllers/productController';
import { asyncHandler } from '../middlewares/asyncHandler';

const productRouter = express.Router();

productRouter.route('/')
    .get(auth.verifyAccessTokenOptional,
        asyncHandler(getProductList))
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
        asyncHandler(likeProduct));

export default productRouter;