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
class CommentRepository {
    getList(query, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return type === 'product' ?
                yield prisma_1.default.productComment.findMany(query) :
                yield prisma_1.default.articleComment.findMany(query);
        });
    }
    saveComment(input, userId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdComment = type === 'product' ?
                yield prisma_1.default.productComment.create({
                    data: {
                        content: input.content,
                        user: {
                            connect: { id: userId },
                        },
                        product: {
                            connect: { id: input.productId },
                        },
                    },
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        userId: true,
                    },
                }) :
                yield prisma_1.default.articleComment.create({
                    data: {
                        content: input.content,
                        user: {
                            connect: { id: userId },
                        },
                        article: {
                            connect: { id: input.articleId },
                        },
                    },
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        userId: true,
                    },
                });
            return createdComment;
        });
    }
    ;
    updateComment(id, userId, input, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedComment = type === 'product' ?
                yield prisma_1.default.productComment.update({
                    where: { id, userId },
                    data: input,
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        userId: true,
                    },
                }) :
                yield prisma_1.default.articleComment.update({
                    where: { id, userId },
                    data: input,
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        userId: true,
                    },
                });
            return updatedComment;
        });
    }
    ;
    deleteById(id, userId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedComment = type === 'product' ?
                yield prisma_1.default.productComment.delete({ where: { id, userId } }) :
                yield prisma_1.default.articleComment.delete({ where: { id, userId } });
            return deletedComment;
        });
    }
}
;
function deleteById(id, userId, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const deletedComment = type === 'product' ?
            yield prisma_1.default.productComment.delete({ where: { id, userId } }) :
            yield prisma_1.default.articleComment.delete({ where: { id, userId } });
        return deletedComment;
    });
}
const commentRepository = new CommentRepository();
exports.default = commentRepository;
