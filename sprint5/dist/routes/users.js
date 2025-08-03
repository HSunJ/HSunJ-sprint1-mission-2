"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const userRouter = express_1.default.Router();
userRouter.route('/')
    .post((0, asyncHandler_1.asyncHandler)(userController_1.createUser));
userRouter.route('/login')
    .post((0, asyncHandler_1.asyncHandler)(userController_1.login));
userRouter.route('/token/refresh')
    .post(auth_js_1.default.verifyRefreshToken, (0, asyncHandler_1.asyncHandler)(userController_1.refreshToken));
userRouter.route('/info')
    .get(auth_js_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(userController_1.getUserInfo))
    .patch(auth_js_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(userController_1.updateUserInfo));
userRouter.route('/info/password')
    .patch(auth_js_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(userController_1.updateUserPassword));
userRouter.route('/info/products')
    .get(auth_js_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(userController_1.getUserProducts));
userRouter.route('/info/likedProducts')
    .get(auth_js_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(userController_1.getLikedProducts));
exports.default = userRouter;
