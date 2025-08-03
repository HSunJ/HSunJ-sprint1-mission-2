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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_js_1 = __importDefault(require("../repositories/userRepository.js"));
const appError_1 = __importDefault(require("../utils/appError"));
const createToken = (user, type) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = { userId: user.id };
    const options = { expiresIn: type === 'refresh' ? '2w' : '12h' };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, options);
});
const refreshToken = (userId, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository_js_1.default.findById(userId);
    if (!user) {
        throw new appError_1.default.NotFoundError("존재하지 않는 유저입니다");
    }
    if (user.refreshToken !== refreshToken) {
        throw new appError_1.default.UnauthorizedError("유효하지 않은 리프레시 토큰입니다");
    }
    return createToken(user, 'access');
});
const checkExistingUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository_js_1.default.findByEmail(email);
    if (user) {
        return true;
    }
    return false;
});
const filterSensitiveUserData = (userData) => {
    const { password, salt, refreshToken } = userData, unsensitiveData = __rest(userData, ["password", "salt", "refreshToken"]);
    return unsensitiveData;
};
exports.default = {
    createToken,
    refreshToken,
    filterSensitiveUserData,
    checkExistingUser,
};
