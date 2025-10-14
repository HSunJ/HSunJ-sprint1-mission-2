import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import prisma from '../src/config/prisma';
import app from '../src/app';
import request from 'supertest';
import testmock from '../prisma/testmock';

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

describe('Article 통합 테스트', () => {
  describe('인증이 필요하지 않은 api', () => {
    test('GET /articles 데이터가 있는 경우', async () => {
      await prisma.article.createMany({
        data: [
          { id: '1', title: '첫 번째 글', content: '첫 번째 글 내용입니다.', userId: 'test-user-id' },
          { id: '2', title: '두 번째 글', content: '두 번째 글 내용입니다.', userId: 'test-user-id' }
        ]
      });
      const response = await request(app).get('/articles');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe('첫 번째 글');
      expect(response.body[1].title).toBe('두 번째 글');
    })
  })
})