"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticleComment = exports.patchArticleComment = exports.createArticleComment = exports.getArticleComments = exports.deleteProductComment = exports.patchProductComment = exports.createProductComment = exports.getProductComments = void 0;
const commentService_1 = __importDefault(require("../services/commentService"));
const appError_1 = __importDefault(require("../utils/appError"));
const getProductComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cursor, limit = 5, order = 'recent' } = req.query;
    const comments = yield commentService_1.default.getCommentList({
        limit: Number(limit),
        order: order,
        cursor: cursor
    }, 'product');
    res.status(200).json(comments);
});
exports.getProductComments = getProductComments;
const createProductComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const comment = yield commentService_1.default.createProductComment(req.body, userId);
    res.status(201).send(comment);
});
exports.createProductComment = createProductComment;
const patchProductComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const comment = yield commentService_1.default.patchProductComment(id, userId, req.body);
    if (!comment) {
        throw new appError_1.default.NotFoundError("댓글이 존재하지 않습니다");
    }
    res.status(202).send(comment);
});
exports.patchProductComment = patchProductComment;
const deleteProductComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    yield commentService_1.default.deleteProductComment(id, userId);
    res.status(204).send({ message: "댓글이 삭제되었습니다" });
});
exports.deleteProductComment = deleteProductComment;
const getArticleComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cursor, limit = 5, order = 'recent' } = req.query;
    const comments = yield commentService_1.default.getCommentList({
        limit: Number(limit),
        order: order,
        cursor: cursor
    }, 'article');
    res.status(200).json(comments);
});
exports.getArticleComments = getArticleComments;
const createArticleComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const comment = yield commentService_1.default.createArticleComment(req.body, userId);
    res.status(201).send(comment);
});
exports.createArticleComment = createArticleComment;
const patchArticleComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const comment = yield commentService_1.default.patchArticleComment(id, userId, req.body);
    if (!comment) {
        throw new appError_1.default.NotFoundError("댓글이 존재하지 않습니다");
    }
    res.status(202).send(comment);
});
exports.patchArticleComment = patchArticleComment;
const deleteArticleComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    yield commentService_1.default.deleteArticleComment(id, userId);
    res.status(204).send({ message: "댓글이 삭제되었습니다" });
});
exports.deleteArticleComment = deleteArticleComment;
