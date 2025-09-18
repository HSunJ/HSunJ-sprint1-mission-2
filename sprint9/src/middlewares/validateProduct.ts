import { RequestHandler } from "express";
import { CreateProduct } from "../structs"
import { assert } from 'superstruct';
import appError from "../utils/appError";

export const validateProduct: RequestHandler = (req, res, next) => {
	try {
		assert(req.body, CreateProduct);
		next();
	} catch (e: any) {
		if (e.name === 'StructError') {
			console.log('CreateProduct 유효성 검사 오류');
			throw new appError.BadRequestError('입력 형식이 올바르지 않습니다.');
		}
		console.log('알 수 없는 서버 오류');
		throw new appError.InternalServerError('서버 오류가 발생했습니다.');
	}
}


