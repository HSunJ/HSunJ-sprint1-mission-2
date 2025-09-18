import { RequestHandler } from "express";
import { CreateArticle } from "../structs"
import { assert } from 'superstruct';
import appError from "../utils/appError";

export const validateArticle: RequestHandler = (req, res, next) => {
  try {
    assert(req.body, CreateArticle);
    next();
  } catch (error: any) {
    if (error.name === 'StructError') {
      console.log('CreateArticle 유효성 검사 오류');
      throw new appError.BadRequestError('입력 형식이 올바르지 않습니다.');
    }
    console.log('알 수 없는 서버 오류');
    throw new appError.InternalServerError('서버 오류가 발생했습니다.');
  }
}