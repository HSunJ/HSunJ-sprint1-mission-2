"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateProduct_1 = require("../middlewares/validateProduct");
const auth_1 = __importDefault(require("../middlewares/auth"));
const productController_1 = require("../controllers/productController");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const productRouter = express_1.default.Router();
productRouter.route('/')
    .get(auth_1.default.verifyAccessTokenOptional, (0, asyncHandler_1.asyncHandler)(productController_1.getProductList))
    .post(validateProduct_1.validateProduct, auth_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(productController_1.createProduct));
productRouter.route('/:id')
    .get(auth_1.default.verifyAccessTokenOptional, (0, asyncHandler_1.asyncHandler)(productController_1.getProduct))
    .patch(auth_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(productController_1.patchProduct))
    .delete(auth_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(productController_1.deleteProduct))
    .post(auth_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(productController_1.likeProduct));
exports.default = productRouter;
