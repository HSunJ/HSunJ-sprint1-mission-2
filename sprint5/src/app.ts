import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction, Errback, ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import { Prisma } from '@prisma/client';

import appError from './utils/appError';

import productRouter from './routes/product';
import articleRouter from './routes/article';
import uploadRouter from './routes/upload';
import commentRouter from './routes/coments';
import userRouter from './routes/users';
import { fileURLToPath } from 'url';
import { StructError } from 'superstruct';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const filename = __filename;
const dir = path.dirname(filename);
app.use(express.static(path.join(dir, 'uploads')));


app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/comments', commentRouter)
app.use('/files', uploadRouter);
app.use('/users', userRouter);


app.use('/', (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof appError.AppError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    return res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
  }
  if (err.name === 'StructError' && (err as StructError).failures) {
    console.error('유효성 검사 에러:', (err as StructError).failures());
    return res.status(400).json({ message: '입력 형식이 올바르지 않습니다.' });
  }
  res.status(500).json({ message: err.message });
  console.log(err.message);
})

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
