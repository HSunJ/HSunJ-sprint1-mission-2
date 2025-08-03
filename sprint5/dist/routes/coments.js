"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_js_1 = require("../controllers/commentController.js");
const auth_js_1 = __importDefault(require("../middlewares/auth.js"));
const commentRouter = express_1.default.Router();
commentRouter.route('/products')
    .get(commentController_js_1.getProductComments)
    .post(auth_js_1.default.verifyAccessToken, commentController_js_1.createProductComment);
commentRouter.route('/products/:id')
    .patch(auth_js_1.default.verifyAccessToken, commentController_js_1.patchProductComment)
    .delete(auth_js_1.default.verifyAccessToken, commentController_js_1.deleteProductComment);
commentRouter.route('/articles')
    .get(commentController_js_1.getArticleComments)
    .post(auth_js_1.default.verifyAccessToken, commentController_js_1.createArticleComment);
commentRouter.route('/articles/:id')
    .patch(auth_js_1.default.verifyAccessToken, commentController_js_1.patchArticleComment)
    .delete(auth_js_1.default.verifyAccessToken, commentController_js_1.deleteArticleComment);
exports.default = commentRouter;
