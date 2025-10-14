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
const prisma_1 = __importDefault(require("../config/prisma"));
class ArticleRepository {
    getList(userId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (userId, { keyword, order, offset, limit }) {
            const orderBy = order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };
            return yield prisma_1.default.article.findMany({
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                    likedUser: userId ? { where: { id: userId } } : false
                },
                where: {
                    OR: [
                        { title: { contains: keyword, mode: 'insensitive' } },
                        { content: { contains: keyword, mode: 'insensitive' } }
                    ]
                },
                orderBy,
                skip: Number(offset),
                take: Number(limit),
            });
        });
    }
    getById(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.article.findUniqueOrThrow({
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                    likedUser: userId ? {
                        where: { id: userId },
                        select: { id: true }
                    } : false,
                },
                where: { id },
            });
        });
    }
    getLiked(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.article.findUnique({
                select: {
                    likedUser: { where: { id: userId }, select: { id: true } }
                },
                where: { id },
            });
        });
    }
    createArticle(userId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.article.create({
                data: Object.assign(Object.assign({}, input), { author: { connect: { id: userId } } }),
                select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true
                }
            });
        });
    }
    patchArticle(userId, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.article.update({
                where: {
                    id,
                    userId
                },
                data
            });
        });
    }
    deleteArticle(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.article.delete({
                where: {
                    id,
                    userId
                }
            });
        });
    }
    like(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.article.update({
                where: { id },
                data
            });
        });
    }
    unlike(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.article.update({
                where: { id },
                data
            });
        });
    }
}
const articleRepository = new ArticleRepository();
exports.default = articleRepository;
