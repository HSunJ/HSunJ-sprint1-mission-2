import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import prisma from '../src/config/prisma';
import app from '../src/app';
import request from 'supertest';
import testmock from '../prisma/testmock';
import jwt from 'jsonwebtoken';

beforeEach(async () => {
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user.create({ data: { id: 'test-user-id', email: 'test@example.com', password: 'hashedpassword', name: 'Test User' } });
  await prisma.product.createMany({ data: testmock.PRODUCTS.map(product => ({ ...product, userId: 'test-user-id' })) });
})

afterEach(async () => {
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();
})

afterAll(async () => {
  // DB 연결 해제
  await prisma.$disconnect();
});

describe('Product 통합 테스트', () => {
  describe('비 로그인', () => {
    describe('GET /products', () => {
      test('상품이 있는 경우', async () => {
        const response = await request(app).get('/products').query({ order: 'oldest' });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(5);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('price');
        expect(response.body[0]).toHaveProperty('createdAt');
        expect(response.body[0]).toHaveProperty('isLiked');

        expect(response.body[0].name).toBe('랑방 샤워젤 세트');
        expect(response.body[0].price).toBe(38000);
        expect(response.body[1].name).toBe('나이키 테크조그거팬츠');
      })

      test('상품이 없는 경우', async () => {
        await prisma.product.deleteMany();
        const response = await request(app).get('/products');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
      })
    })

    describe('GET /products/:id', () => {
      test('상품이 있는 경우', async () => {
        const response = await request(app).get('/products/f8013040-b076-4dc4-8677-11be9a17162f');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('price');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('isLiked');

        expect(response.body.name).toBe('랑방 샤워젤 세트');
        expect(response.body.price).toBe(38000);
      })
      test('상품이 없는 경우', async () => {
        const response = await request(app).get('/products/some-wrong-id');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("상품이 존재하지 않습니다");
      })
    })
  })

  describe('로그인', () => {
    describe('POST /products', () => {
      test('상품 생성 - 입력값 정상', async () => {
        const token = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        const response = await request(app).post('/products')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: '새로운 상품',
            description: '새로운 상품 설명',
            price: 10000,
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('price');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('isLiked');
        expect(response.body).not.toHaveProperty('description');

        expect(response.body.name).toBe('새로운 상품');
        expect(response.body.price).toBe(10000);
        expect(response.body.isLiked).toBe(false);
      })

      test('상품 생성 - 입력값 비정상 (name 없음)', async () => {
        const token = jwt.sign({ id: 'test-user-id', email: 'test@example.com' }, process.env.JWT_SECRET);
        const response = await request(app).post('/products')
          .set('Authorization', `Bearer ${token}`)
          .send({
            description: '새로운 상품 설명',
            price: 10000
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("입력 형식이 올바르지 않습니다.");
      })

      test('상품 생성 - 로그인 안함', async () => {
        const response = await request(app).post('/products')
          .send({
            name: '새로운 상품',
            description: '새로운 상품 설명',
            price: 10000,
          });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("로그인이 필요합니다.");
      })
    })

    describe('PATCH /product/:id', () => {
      test('상품 수정 - 입력값 정상', async () => {
        const token = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        const response = await request(app).patch('/products/f8013040-b076-4dc4-8677-11be9a17162f')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: '수정된 상품명', price: 50000 });

        expect(response.status).toBe(202);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('description');
        expect(response.body).toHaveProperty('price');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('isLiked');
        expect(response.body.name).toBe('수정된 상품명');
        expect(response.body.price).toBe(50000);
      })

      test('상품 수정 - 상품 없음', async () => {
        const token = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        const response = await request(app).patch('/products/some-wrong-id')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: '수정된 상품명', price: 50000 });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("상품이 존재하지 않습니다");
      })

      test('상품 수정 - 권한 없음', async () => {
        const token = jwt.sign({ userId: 'wrong-user-id' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        const response = await request(app).patch('/products/f8013040-b076-4dc4-8677-11be9a17162f')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: '수정된 상품명', price: 50000 });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("권한이 없습니다");
      })

      test('상품 수정 - 로그인 안함', async () => {
        const response = await request(app).patch('/products/f8013040-b076-4dc4-8677-11be9a17162f')
          .send({ name: '수정된 상품명', price: 50000 });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("로그인이 필요합니다.");
      })
    })

    describe('DELETE /product/:id', () => {
      test('상품 삭제 - 정상', async () => {
        const token = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        const response = await request(app).delete('/products/f8013040-b076-4dc4-8677-11be9a17162f')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
      })

      test('상품 삭제 - 상품 없음', async () => {
        const token = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        const response = await request(app).delete('/products/some-wrong-id')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("상품이 존재하지 않습니다");
      })

      test('상품 삭제 - 권한 없음', async () => {
        const token = jwt.sign({ userId: 'wrong-user-id' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        const response = await request(app).delete('/products/f8013040-b076-4dc4-8677-11be9a17162f')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("권한이 없습니다");
      })

      test('상품 삭제 - 로그인 안함', async () => {
        const response = await request(app).delete('/products/f8013040-b076-4dc4-8677-11be9a17162f');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("로그인이 필요합니다.");
      })
    })

    describe('POST /products/:id/like', () => {
      test('상품 좋아요 - 정상', async () => {
        const token = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        const response = await request(app).post('/products/f8013040-b076-4dc4-8677-11be9a17162f')
          .set('Authorization', `Bearer ${token}`);

        console.log(response.body);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("좋아요를 눌렀습니다");
      })

      test('상품 좋아요 취소 - 정상', async () => {
        const token = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        await request(app).post('/products/f8013040-b076-4dc4-8677-11be9a17162f')
          .set('Authorization', `Bearer ${token}`);
        const response = await request(app).post('/products/f8013040-b076-4dc4-8677-11be9a17162f')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("좋아요가 취소되었습니다.");
      })

      test('상품 좋아요 - 상품 없음', async () => {
        const token = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        const response = await request(app).post('/products/some-wrong-id')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("상품이 존재하지 않습니다");
      })

      test('상품 좋아요 - 로그인 안함', async () => {
        const response = await request(app).post('/products/f8013040-b076-4dc4-8677-11be9a17162f');
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe("로그인이 필요합니다.");
      })
    })
  })
})
