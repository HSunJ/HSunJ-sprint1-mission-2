"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = require("express-jwt");
const verifyAccessToken = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'user',
});
// userId가 선택적으로 필요한 경우에 사용
const verifyAccessTokenOptional = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'user',
    credentialsRequired: false
});
const verifyRefreshToken = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.refreshToken,
    requestProperty: 'user'
});
exports.default = {
    verifyAccessToken,
    verifyAccessTokenOptional,
    verifyRefreshToken,
};
