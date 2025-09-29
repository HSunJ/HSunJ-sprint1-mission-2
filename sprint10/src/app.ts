import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction, Errback, ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import appError from './utils/appError';
import productRouter from './routes/product';
import articleRouter from './routes/article';
import uploadRouter from './routes/upload';
import commentRouter from './routes/coments';
import userRouter from './routes/users';
import notificationRouter from './routes/notificationRoute';

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
app.use('/notifications', notificationRouter);


app.use('/', (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof appError.AppError) {
    return res.status(err.status).json({ message: err.message });
  }
  else if(err.name === 'UnauthorizedError') return res.status(401).json({ message: '로그인이 필요합니다.' });
  else res.status(500).json({ message: err.message });
})

export default app;
