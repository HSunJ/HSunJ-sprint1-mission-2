"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateProduct_1 = require("../middlewares/validateProduct");
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const productController_js_1 = require("../controllers/productController.js");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const productRouter = express_1.default.Router();
productRouter.route('/')
    .get(auth_js_1.default.verifyAccessTokenOptional, (0, asyncHandler_1.asyncHandler)(productController_js_1.getProductList))
    .post(validateProduct_1.validateProduct, auth_js_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(productController_js_1.createProduct));
productRouter.route('/:id')
    .get(auth_js_1.default.verifyAccessTokenOptional, (0, asyncHandler_1.asyncHandler)(productController_js_1.getProduct))
    .patch(auth_js_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(productController_js_1.patchProduct))
    .delete(auth_js_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(productController_js_1.deleteProduct))
    .post(auth_js_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(productController_js_1.likeProduct));
exports.default = productRouter;
