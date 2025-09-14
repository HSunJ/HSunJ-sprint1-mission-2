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
const productRepository_1 = __importDefault(require("../repositories/productRepository"));
const appError_1 = __importDefault(require("../utils/appError"));
const socket_1 = require("../socket");
const connectionHandler_1 = require("../socket/handler/connectionHandler");
const roomUtils_1 = require("../utils/roomUtils");
class ProductService {
    getProductList(userId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield productRepository_1.default.getList(userId, params);
            const displayProductList = products.map((product) => {
                const isLiked = product.likedUser ? product.likedUser.length > 0 : false;
                return {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    createdAt: product.createdAt,
                    isLiked
                };
            });
            return displayProductList;
        });
    }
    getProduct(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield productRepository_1.default.getById(userId, id);
            const isLiked = product.likedUser ? product.likedUser.length > 0 : false;
            const displayProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                createdAt: product.createdAt,
                isLiked
            };
            return displayProduct;
        });
    }
    createProduct(input, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield productRepository_1.default.createProduct(input, userId);
            const displayProduct = Object.assign(Object.assign({}, product), { isLiked: false });
            return displayProduct;
        });
    }
    patchProduct(userId, id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const oldProduct = yield productRepository_1.default.getById(userId, id, tx, { price: true });
                const product = yield productRepository_1.default.patchProduct(id, userId, input, tx);
                if (!product) {
                    throw new appError_1.default.NotFoundError("상품이 존재하지 않습니다");
                }
                if (oldProduct.price !== product.price) {
                    // 가격이 변경된 경우에 대한 처리
                    const likedUsers = product.likedUser.map(user => user.id);
                    const productData = {
                        id,
                        name: product.name,
                        oldprice: oldProduct.price,
                        newprice: product.price,
                        likedUsers
                    };
                    const priceChangeNotifications = likedUsers.map(targetId => ({
                        userId: targetId,
                        type: 'PRODUCT_PRICE_CHANGE',
                        content: `${product.name}의 가격이 변경되었습니다: ${oldProduct.price} -> ${product.price}`,
                        relatedId: id,
                    }));
                }
                const isLiked = product.likedUser.filter(user => user.id === userId);
                const displayProduct = {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    tag: product.tag,
                    createdAt: product.createdAt,
                    isLiked: isLiked.length > 0
                };
                return displayProduct;
            }));
        });
    }
    deleteProduct(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield productRepository_1.default.deleteProduct(id, userId);
        });
    }
    isLiked(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield productRepository_1.default.getById(userId, id);
            if (!product) {
                throw new appError_1.default.NotFoundError("게시글이 존재하지 않습니다");
            }
            return product.likedUser ? product.likedUser.length > 0 : false;
        });
    }
    likeProduct(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield productRepository_1.default.like(id, {
                likedUser: {
                    connect: { id: userId }
                }
            });
            // 유저를 상품 ID룸에 추가
            const io = (0, socket_1.getSocketIo)();
            const userSockets = connectionHandler_1.connectedUsers.get(userId);
            if (userSockets)
                (0, roomUtils_1.joinRoom)(`product:${id}`, io, userSockets);
        });
    }
    unlikeProduct(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield productRepository_1.default.unlike(id, {
                likedUser: {
                    disconnect: { id: userId }
                }
            });
            // 유저를 상품 ID룸에서 제거
            const io = (0, socket_1.getSocketIo)();
            const userSockets = connectionHandler_1.connectedUsers.get(userId);
            if (userSockets)
                (0, roomUtils_1.leaveRoom)(`product:${id}`, io, userSockets);
        });
    }
}
const productService = new ProductService();
exports.default = productService;
