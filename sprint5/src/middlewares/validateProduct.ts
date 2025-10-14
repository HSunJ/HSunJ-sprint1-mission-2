import { RequestHandler } from "express";
import { CreateProduct } from "../structs"
import { assert } from 'superstruct';

export const validateProduct: RequestHandler = (req, res, next) => {
	try {
		assert(req.body, CreateProduct);
		next();
	} catch (e: any) {
		if (e.name === 'StructError') {
			console.log('CreateProduct 유효성 검사 오류');
			return res.status(400).json({ message: '입력 형식이 올바르지 않습니다.' });
		}
		console.log('알 수 없는 서버 오류');
		return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
	}
}


