"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as dotenv from 'dotenv';
const express_1 = __importDefault(require("express"));
const validateArticle_1 = require("../middlewares/validateArticle");
const articleController_js_1 = require("../controllers/articleController.js");
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const articleRouter = express_1.default.Router();
articleRouter.route('/')
    .get(auth_js_1.default.verifyAccessTokenOptional, (0, asyncHandler_1.asyncHandler)(articleController_js_1.getArticleList))
    .post(validateArticle_1.validateArticle, auth_js_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(articleController_js_1.createArticle));
articleRouter.route('/:id')
    .get(auth_js_1.default.verifyAccessTokenOptional, (0, asyncHandler_1.asyncHandler)(articleController_js_1.getArticle))
    .patch(auth_js_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(articleController_js_1.patchArticle))
    .delete(auth_js_1.default.verifyAccessToken, (0, asyncHandler_1.asyncHandler)(articleController_js_1.deleteArticle));
exports.default = articleRouter;
