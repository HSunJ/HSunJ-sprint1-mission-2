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
const commentRepository_1 = __importDefault(require("../repositories/commentRepository"));
const appError_1 = __importDefault(require("../utils/appError"));
class CommentService {
    getCommentList(params, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const take = params.limit || 5;
            const orderBy = params.order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };
            const query = {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                },
                take,
                orderBy,
            };
            if (params.cursor) {
                query.cursor = { id: params.cursor };
                query.skip = 1;
            }
            const comments = yield commentRepository_1.default.getList(query, type);
            if (!comments) {
                throw new appError_1.default.NotFoundError("댓글이 존재하지 않습니다");
            }
            let nextCursor = null;
            if (comments.length === take) {
                nextCursor = comments[comments.length - 1].id;
            }
            const displayCommentList = {
                data: comments,
                nextCursor,
                hasMore: comments.length === take,
            };
            return displayCommentList;
        });
    }
    createProductComment(input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield commentRepository_1.default.saveComment(input, userId, 'product');
            const displayComment = {
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                userId: comment.userId,
            };
            return displayComment;
        });
    }
    createArticleComment(input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield commentRepository_1.default.saveComment(input, userId, 'article');
            const displayComment = {
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                userId: comment.userId,
            };
            return displayComment;
        });
    }
    patchProductComment(id, userId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedComment = yield commentRepository_1.default.updateComment(id, userId, input, 'product');
            const displayComment = {
                id: updatedComment.id,
                content: updatedComment.content,
                createdAt: updatedComment.createdAt,
                userId: updatedComment.userId,
            };
            return displayComment;
        });
    }
    patchArticleComment(id, userId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedComment = yield commentRepository_1.default.updateComment(id, userId, input, 'article');
            const displayComment = {
                id: updatedComment.id,
                content: updatedComment.content,
                createdAt: updatedComment.createdAt,
                userId: updatedComment.userId,
            };
            return displayComment;
        });
    }
    deleteProductComment(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield commentRepository_1.default.deleteById(id, userId, 'product');
        });
    }
    deleteArticleComment(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield commentRepository_1.default.deleteById(id, userId, 'article');
        });
    }
}
const commentService = new CommentService();
exports.default = commentService;
