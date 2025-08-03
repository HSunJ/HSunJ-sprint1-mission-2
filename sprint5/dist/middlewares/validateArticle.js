"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArticle = void 0;
const structs_js_1 = require("../structs.js");
const superstruct_1 = require("superstruct");
const validateArticle = (req, res, next) => {
    try {
        (0, superstruct_1.assert)(req.body, structs_js_1.CreateArticle);
        next();
    }
    catch (error) {
        if (error.name === 'StructError') {
            console.log('CreateArticle 유효성 검사 오류');
            return res.status(400).json({ message: '입력 형식이 올바르지 않습니다.' });
        }
        console.log('알 수 없는 서버 오류');
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
exports.validateArticle = validateArticle;
