// import * as dotenv from 'dotenv';
import express from 'express';
import { validateProduct } from '../middlewares/validateProduct.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

import {getProducts, getProduct, createProduct, patchProduct, deleteProduct} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.route('/')
    .get(asyncHandler(getProducts))
    .post(validateProduct, asyncHandler(createProduct));


productRouter.route('/:id')
    .get(asyncHandler(getProduct))
    .patch(asyncHandler(patchProduct))
    .delete(asyncHandler(deleteProduct));

export default productRouter;