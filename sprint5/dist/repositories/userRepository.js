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
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.user.findUnique({
            where: {
                id,
            },
        });
    });
}
function findByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_js_1.default.user.findUnique({
            where: {
                email,
            },
        });
    });
}
function save(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.user.create({
            data: Object.assign({}, userData),
        });
    });
}
function update(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_js_1.default.user.update({
            where: {
                id,
            },
            data: data,
        });
    });
}
// async function createOrUpdate(provider, providerId, email, name) {
//   return prisma.user.upsert({
//     where: { provider, providerId },
//     update: { email, name },
//     create: { provider, providerId, email, name },
//   });
// }
function getProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_js_1.default.user.findUnique({
            where: { id },
            select: {
                createdProducts: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        createdAt: true,
                        likedUser: {
                            where: { id },
                            select: { id: true }
                        }
                    }
                }
            }
        });
    });
}
function getLikedProductList(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_js_1.default.user.findUnique({
            where: { id },
            select: {
                likedProducts: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        createdAt: true,
                    }
                }
            }
        });
    });
}
function getArticleById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_js_1.default.user.findUnique({
            where: { id },
            select: {
                createdArticles: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        createdAt: true,
                        likedUser: {
                            where: { id },
                            select: { id: true }
                        }
                    }
                }
            }
        });
    });
}
function getLikedArticleList(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_js_1.default.user.findUnique({
            where: { id },
            select: {
                likedArticles: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        createdAt: true,
                    }
                }
            }
        });
    });
}
exports.default = {
    findById,
    findByEmail,
    save,
    update,
    // createOrUpdate,
    getProductById,
    getLikedProductList,
    getArticleById,
    getLikedArticleList
};
