import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import prisma from '../src/config/prisma';
import app from '../src/app';
import request from 'supertest';
import { hashPassword } from '../src/utils/hash';

beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.user.create({ data: { id: 'test-user-id', email: 'test@example.com', password: (await hashPassword('password')).password, name: 'Test User' } });
})

afterEach(async () => {
  await prisma.user.deleteMany();
})

afterAll(async () => {
  // DB 연결 해제
  await prisma.$disconnect();
});

describe('User 통합 테스트', () => {
  describe('POST /users', () => {
    test('회원가입 - 정상', async() => {
      const response = await request(app).post('/users')
        .send({ email: 'new@example.com', password: 'password', name: 'New User' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', 'new@example.com');
      expect(response.body).toHaveProperty('name', 'New User');
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('salt');
      expect(response.body).not.toHaveProperty('refreshToken');
    })

    test('회원가입 - 이미 존재하는 이메일', async() => {
      const response = await request(app).post('/users')
        .send({ email: 'test@example.com', password: 'password', name: 'Test User' });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', '이미 존재하는 유저입니다.');
    })
  })

  describe('POST /login', () => {
    test('로그인 - 정상', async() => {
      const response = await request(app).post('/users/login')
        .send({ email: 'test@example.com', password: 'password' });
 
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
    })

    test('로그인 - 존재하지 않는 이메일', async() => {
      const response = await request(app).post('/users/login')
        .send({ email: 'notfound@example.com', password: 'password' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', '존재하지 않는 유저입니다');
    })

    test('로그인 - 잘못된 비밀번호', async() => {
      const response = await request(app).post('/users/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', '비밀번호가 틀렸습니다');
    })
  })
})