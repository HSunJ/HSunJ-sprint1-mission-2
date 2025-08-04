import Express from 'express';

// req.user 객체에 대한 타입 정의
declare global {
  namespace Express {
    interface Request { // req.user에 대한 타입 정의
      user?: { // 로그인하지 않은 경우도 고려하여 optional로 설정
        userId: string;
      };
    }
  }
}