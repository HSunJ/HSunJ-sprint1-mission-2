import * as dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { PrismaClient, Prisma } from '@prisma/client';
import productRouter from './routes/product.js';
import articleRouter from './routes/article.js';
import uploadRouter from './routes/upload.js';
import commentRouter from './routes/coments.js';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const filename = fileURLToPath(import.meta.url);
const dir = path.dirname(filename);
app.use(express.static(path.join(dir, 'uploads')));


app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/comments', commentRouter )
app.use('/files', uploadRouter);


app.use('/', (err, req, res, next) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    return res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
  }

  if (err.name === 'StructError' && err.failures) {
    console.error('유효성 검사 에러:', err.failures());
    return res.status(400).json({ message: '입력 형식이 올바르지 않습니다.' });
  }
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  console.log(err.message);
})

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
