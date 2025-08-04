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
exports.likeArticle = exports.deleteArticle = exports.patchArticle = exports.createArticle = exports.getArticle = exports.getArticleList = void 0;
const client_1 = require("@prisma/client");
const structs_1 = require("../structs");
const superstruct_1 = require("superstruct");
const articleRepository_1 = __importDefault(require("../repositories/articleRepository"));
const articleService_1 = __importDefault(require("../services/articleService"));
const prisma = new client_1.PrismaClient();
const getArticleList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { offset = 0, limit = 10, order, keyword = "" } = req.query;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const articleList = yield articleService_1.default.getArticleList(userId, {
        keyword: keyword,
        order: order,
        offset: Number(offset),
        limit: Number(limit)
    });
    res.status(200).send(articleList);
});
exports.getArticleList = getArticleList;
const getArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const article = yield articleService_1.default.getArticle(userId, id);
    res.status(200).send(article);
});
exports.getArticle = getArticle;
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const article = yield articleService_1.default.saveArticle(userId, req.body);
    res.status(201).send(article);
});
exports.createArticle = createArticle;
const patchArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (0, superstruct_1.assert)(req.body, structs_1.PatchArticle);
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const article = yield articleRepository_1.default.patchArticle(userId, id, req.body);
    res.status(202).send(article);
});
exports.patchArticle = patchArticle;
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    yield articleService_1.default.deleteArticle(userId, id);
    res.status(204).send({ message: "게시글이 삭제되었습니다" });
});
exports.deleteArticle = deleteArticle;
const likeArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const id = req.params.id;
    if (yield articleService_1.default.isLiked(userId, id)) {
        yield articleService_1.default.unlikeArticle(userId, id);
        res.status(201).json({ message: "좋아요가 취소되었습니다." });
    }
    else {
        yield articleService_1.default.likeArticle(userId, id);
        res.status(201).json({ message: "좋아요를 눌렀습니다" });
    }
});
exports.likeArticle = likeArticle;
