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
exports.likeProduct = exports.deleteProduct = exports.patchProduct = exports.createProduct = exports.getProduct = exports.getProductList = void 0;
const structs_1 = require("../structs");
const superstruct_1 = require("superstruct");
const productService_1 = __importDefault(require("../services/productService"));
const getProductList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { offset = 0, limit = 10, order = "recent", keyword = "" } = req.query;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const products = yield productService_1.default.getProductList(userId, {
        keyword: keyword,
        order: order,
        offset: Number(offset),
        limit: Number(limit)
    });
    res.status(200).send(products);
});
exports.getProductList = getProductList;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const product = yield productService_1.default.getProduct(userId, id);
    res.status(200).send(product);
});
exports.getProduct = getProduct;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (0, superstruct_1.assert)(req.body, structs_1.CreateProduct);
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const product = yield productService_1.default.createProduct(req.body, userId);
    res.status(201).send(product);
});
exports.createProduct = createProduct;
const patchProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (0, superstruct_1.assert)(req.body, structs_1.PatchProduct);
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const product = yield productService_1.default.patchProduct(userId, id, req.body);
    res.status(202).send(product);
});
exports.patchProduct = patchProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    yield productService_1.default.deleteProduct(userId, id);
    res.status(204).send({ message: "게시글이 삭제되었습니다" });
});
exports.deleteProduct = deleteProduct;
const likeProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const id = req.params.id;
    if (yield productService_1.default.isLiked(userId, id)) {
        yield productService_1.default.unlikeProduct(userId, id);
        res.status(201).json({ message: "좋아요가 취소되었습니다." });
    }
    else {
        yield productService_1.default.likeProduct(userId, id);
        res.status(201).json({ message: "좋아요를 눌렀습니다" });
    }
});
exports.likeProduct = likeProduct;
