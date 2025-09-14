"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySocketToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifySocketToken = (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        const err = new Error("인증 토큰이 없습니다.");
        return next(err);
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    socket.data.user = decoded;
    next();
};
exports.verifySocketToken = verifySocketToken;
