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
const articleRepository_1 = __importDefault(require("../repositories/articleRepository"));
const appError_1 = __importDefault(require("../utils/appError"));
class ArticleService {
    getArticleList(userId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const articles = yield articleRepository_1.default.getList(userId, params);
            const displayArticleList = articles.map((article) => {
                const isLiked = article.likedUser ? article.likedUser.length > 0 : false;
                return {
                    id: article.id,
                    title: article.title,
                    content: article.content,
                    createdAt: article.createdAt,
                    isLiked
                };
            });
            return displayArticleList;
        });
    }
    getArticle(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield articleRepository_1.default.getById(userId, id);
            const isLiked = article.likedUser ? article.likedUser.length > 0 : false;
            const displayArticle = {
                id: article.id,
                title: article.title,
                content: article.content,
                createdAt: article.createdAt,
                isLiked
            };
            return displayArticle;
        });
    }
    saveArticle(userId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield articleRepository_1.default.createArticle(userId, input);
            const displayArticle = {
                id: article.id,
                title: article.title,
                content: article.content,
                createdAt: article.createdAt,
                isLiked: false
            };
            return displayArticle;
        });
    }
    patchArticle(userId, id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield articleRepository_1.default.patchArticle(userId, id, input);
            if (!article) {
                throw new appError_1.default.NotFoundError("게시글이 존재하지 않습니다");
            }
            const isLiked = article.likedUser ? article.likedUser.length > 0 : false;
            const displayArticle = {
                id: article.id,
                title: article.title,
                content: article.content,
                createdAt: article.createdAt,
                isLiked
            };
            return displayArticle;
        });
    }
    deleteArticle(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield articleRepository_1.default.deleteArticle(userId, id);
        });
    }
    isLiked(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield articleRepository_1.default.getById(userId, id);
            if (!article) {
                throw new appError_1.default.NotFoundError("게시글이 존재하지 않습니다");
            }
            return article.likedUser ? article.likedUser.length > 0 : false;
        });
    }
    likeArticle(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield articleRepository_1.default.like(id, {
                likedUser: {
                    connect: { id: userId }
                }
            });
        });
    }
    unlikeArticle(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield articleRepository_1.default.unlike(id, {
                likedUser: {
                    disconnect: { id: userId }
                }
            });
        });
    }
}
const articleService = new ArticleService();
exports.default = articleService;
