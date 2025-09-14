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
class ProductRepository {
    getList(userId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (userId, { keyword, order, offset, limit }) {
            const orderBy = order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };
            return yield prisma_1.default.product.findMany({
                select: {
                    id: true,
                    name: true,
                    price: true,
                    createdAt: true,
                    likedUser: userId ? {
                        where: { id: userId },
                        select: { id: true }
                    } : false
                },
                where: keyword ? {
                    OR: [
                        { name: { contains: keyword, mode: 'insensitive' } },
                        { description: { contains: keyword, mode: 'insensitive' } }
                    ]
                } : undefined,
                orderBy,
                skip: offset,
                take: limit
            });
        });
    }
    getById(userId, id, tx, select) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultSelect = {
                id: true,
                name: true,
                description: true,
                price: true,
                tag: true,
                createdAt: true,
                likedUser: userId ? {
                    where: { id: userId },
                    select: { id: true }
                } : false,
            };
            return yield (tx || prisma_1.default).product.findUniqueOrThrow({
                select: select || defaultSelect,
                where: {
                    id,
                },
            });
        });
    }
    getLiked(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.product.findUnique({
                select: {
                    likedUser: { where: { id: userId }, select: { id: true } }
                },
                where: { id },
            });
        });
    }
    createProduct(input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.product.create({
                data: Object.assign(Object.assign({}, input), { author: { connect: { id: userId } } }),
                select: {
                    id: true,
                    name: true,
                    price: true,
                    createdAt: true
                }
            });
        });
    }
    patchProduct(id, userId, data, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (tx || prisma_1.default).product.update({
                where: {
                    id,
                    userId
                },
                data,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    tag: true,
                    createdAt: true,
                    likedUser: { select: { id: true } }
                }
            });
        });
    }
    deleteProduct(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.product.delete({
                where: {
                    id,
                    userId
                }
            });
        });
    }
    like(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.product.update({
                where: { id },
                data
            });
        });
    }
    unlike(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.product.update({
                where: { id },
                data
            });
        });
    }
}
const getLikedUser = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
        where: { id },
        select: {
            likedUser: {
                where: { id: userId },
                select: { id: true }
            }
        }
    });
    return product ? product.likedUser : null;
});
const productRepository = new ProductRepository();
exports.default = productRepository;
