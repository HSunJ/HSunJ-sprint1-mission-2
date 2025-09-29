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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLikedArticles = exports.getUserArticles = exports.getLikedProducts = exports.getUserProducts = exports.updateUserPassword = exports.updateUserInfo = exports.getUserInfo = exports.refreshToken = exports.login = exports.createUser = void 0;
const hash_1 = require("../utils/hash");
const userService_1 = __importDefault(require("../services/userService"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const appError_1 = __importDefault(require("../utils/appError"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, salt } = yield (0, hash_1.hashPassword)(req.body.password);
        const userData = Object.assign(Object.assign({}, req.body), { password,
            salt });
        if (yield userService_1.default.checkExistingUser(userData.email)) {
            throw new appError_1.default.ConflictError("이미 존재하는 유저입니다.");
        }
        const newUser = yield userRepository_1.default.save(userData);
        return res.status(201).json(userService_1.default.filterSensitiveUserData(newUser));
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const sensitiveUser = yield userRepository_1.default.findByEmail(email);
        if (!sensitiveUser) {
            throw new appError_1.default.NotFoundError("존재하지 않는 유저입니다");
        }
        if (!(yield (0, hash_1.checkPassword)(password, sensitiveUser.password))) {
            throw new appError_1.default.UnauthorizedError("비밀번호가 틀렸습니다");
        }
        const user = userService_1.default.filterSensitiveUserData(sensitiveUser);
        // 로그인할때 액세스토큰과 리프래시토큰 발급
        const accessToken = yield userService_1.default.createToken(user, 'access');
        const refreshToken = yield userService_1.default.createToken(user, 'refresh');
        // 리프래시토큰 db에 저장
        yield userRepository_1.default.update(user.id, { refreshToken });
        // 리프레시 토큰을 쿠키에 담아 전달
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        const response = Object.assign(Object.assign({}, user), { accessToken, message: "로그인에 성공했습니다" });
        return res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const refreshToken = req.cookies.refreshToken;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const newAccessToken = yield userService_1.default.refreshToken(userId, refreshToken);
        return res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        next(error);
    }
});
exports.refreshToken = refreshToken;
const getUserInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const userInfo = yield userRepository_1.default.findById(userId);
        if (!userInfo) {
            throw new appError_1.default.NotFoundError("존재하지 않는 유저입니다");
        }
        res.status(201).json(userService_1.default.filterSensitiveUserData(userInfo));
    }
    catch (error) {
        next(error);
    }
});
exports.getUserInfo = getUserInfo;
const updateUserInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const userData = req.body;
        const updatedUserInfo = yield userRepository_1.default.update(userId, userData);
        res.status(201).json(userService_1.default.filterSensitiveUserData(updatedUserInfo));
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserInfo = updateUserInfo;
const updateUserPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const user = yield userRepository_1.default.findById(userId);
        const plainPassword = req.body.password;
        if (!user) {
            throw new appError_1.default.NotFoundError("존재하지 않는 유저입니다");
        }
        const { password, salt } = yield (0, hash_1.hashPassword)(plainPassword);
        const updatedPassword = yield userRepository_1.default.update(userId, { password, salt });
        res.status(201).json(Object.assign(Object.assign({}, userService_1.default.filterSensitiveUserData(updatedPassword)), { message: "비밀번호가 변경되었습니다" }));
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserPassword = updateUserPassword;
const getUserProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const productList = yield userRepository_1.default.getProductById(userId);
        if (!productList) {
            throw new appError_1.default.NotFoundError("존재하지 않는 유저입니다");
        }
        const displayProductList = productList.createdProducts.map((product) => {
            const isLiked = product.likedUser.length > 0 ? true : false;
            const { likedUser } = product, rest = __rest(product, ["likedUser"]);
            return Object.assign(Object.assign({}, rest), { isLiked });
        });
        res.status(200).json(displayProductList);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserProducts = getUserProducts;
const getLikedProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const likedProductList = yield userRepository_1.default.getLikedProductList(userId);
        if (!likedProductList) {
            throw new appError_1.default.NotFoundError("존재하지 않는 유저입니다");
        }
        const displayLikedProductList = likedProductList.likedProducts.map((product) => {
            return Object.assign(Object.assign({}, product), { isLiked: true });
        });
        res.status(200).json(displayLikedProductList);
    }
    catch (error) {
        next(error);
    }
});
exports.getLikedProducts = getLikedProducts;
const getUserArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const articleList = yield userRepository_1.default.getArticleById(userId);
        if (!articleList) {
            throw new appError_1.default.NotFoundError("존재하지 않는 유저입니다");
        }
        const displayArticleList = articleList.createdArticles.map((article) => {
            const isLiked = article.likedUser.length > 0 ? true : false;
            const { likedUser } = article, rest = __rest(article, ["likedUser"]);
            return Object.assign(Object.assign({}, rest), { isLiked });
        });
        res.status(200).json(displayArticleList);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserArticles = getUserArticles;
const getLikedArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const likedArticleList = yield userRepository_1.default.getLikedArticleList(userId);
        if (!likedArticleList) {
            throw new appError_1.default.NotFoundError("존재하지 않는 유저입니다");
        }
        const displayLikedArticleList = likedArticleList.likedArticles.map((article) => {
            return Object.assign(Object.assign({}, article), { isLiked: true });
        });
        res.status(200).json(displayLikedArticleList);
    }
    catch (error) {
        next(error);
    }
});
exports.getLikedArticles = getLikedArticles;
