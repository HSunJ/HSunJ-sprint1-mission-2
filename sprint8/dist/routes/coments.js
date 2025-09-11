"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const commentRouter = express_1.default.Router();
commentRouter.route('/products')
    .get(commentController_1.getProductComments)
    .post(auth_1.default.verifyAccessToken, commentController_1.createProductComment);
commentRouter.route('/products/:id')
    .patch(auth_1.default.verifyAccessToken, commentController_1.patchProductComment)
    .delete(auth_1.default.verifyAccessToken, commentController_1.deleteProductComment);
commentRouter.route('/articles')
    .get(commentController_1.getArticleComments)
    .post(auth_1.default.verifyAccessToken, commentController_1.createArticleComment);
commentRouter.route('/articles/:id')
    .patch(auth_1.default.verifyAccessToken, commentController_1.patchArticleComment)
    .delete(auth_1.default.verifyAccessToken, commentController_1.deleteArticleComment);
exports.default = commentRouter;
