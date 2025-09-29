import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import productService from '../src/services/productService';
import app from '../src/app';
import request from 'supertest';
import productRepository from '../src/repositories/productRepository';
import testmock from '../prisma/testmock';
import appError from '../src/utils/appError';
import jwt from 'jsonwebtoken';

jest.mock('../src/repositories/productRepository', () => ({
  __esModule: true,
  default: {
    getList: jest.fn(),
    getById: jest.fn(),
    createProduct: jest.fn(),
    patchProduct: jest.fn(),
  }
}));

(productRepository.getById as jest.Mock).mockImplementation((userId, id) => {
  return id === 'product-id' ? {
    id: 'product-id',
    name: 'Test Product 1',
    price: 100,
    createdAt: '2023-01-01T00:00:00.000Z',
    likedUser: false
  } : (() => { throw new appError.NotFoundError("상품이 존재하지 않습니다"); })();
});

(productRepository.createProduct as jest.Mock).mockImplementation((input, userId) => {
  if (!input.name || !input.price) throw new appError.BadRequestError("입력 형식이 올바르지 않습니다");
  return { ...input, id: 'new-product-id', createdAt: '2023-01-01T00:00:00.000Z', isLiked: false };
})

beforeEach(() => {
  jest.clearAllMocks();
})

describe('Product Service Unit Test', () => {
  test('getProducts - 정상', async () => {
    (productRepository.getList as jest.Mock).mockResolvedValue(testmock.PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      createdAt: p.createdAt,
      isLiked: false
    })));
    const spy = jest.spyOn(productRepository, 'getList');
    const response = await request(app).get('/products');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(5);
  })

  test('getproducts - 빈 배열', async () => {
    (productRepository.getList as jest.Mock).mockResolvedValue([]);
    const spy = jest.spyOn(productRepository, 'getList');
    const response = await request(app).get('/products');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  })

  test('getProduct - 정상', async () => {
    const spy = jest.spyOn(productRepository, 'getById');
    const response = await request(app).get('/products/product-id');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 'product-id');
    expect(response.body).toHaveProperty('name', 'Test Product 1');
    expect(response.body).toHaveProperty('price', 100);
    expect(response.body).toHaveProperty('createdAt', '2023-01-01T00:00:00.000Z');
    expect(response.body).toHaveProperty('isLiked', false);
  })

  test('getProduct - 존재하지 않는 상품', async () => {
    const spy = jest.spyOn(productRepository, 'getById');
    const response = await request(app).get('/products/none-id');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', '상품이 존재하지 않습니다');
  })

  test('createProduct - 정상', async () => {
    const spy = jest.spyOn(productRepository, 'createProduct');
    const token = jwt.sign({ userId: 'user-id' }, process.env.JWT_SECRET!);
    const response = await request(app).post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Product', price: 200, description: 'A new product', tag: 'FASHION' });
    
    console.log(response.body);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id', 'new-product-id');
    expect(response.body).toHaveProperty('name', 'New Product');
    expect(response.body).toHaveProperty('price', 200);
    expect(response.body).toHaveProperty('description', 'A new product');
    expect(response.body).toHaveProperty('tag', 'FASHION');
    expect(response.body).toHaveProperty('createdAt', '2023-01-01T00:00:00.000Z');
    expect(response.body).toHaveProperty('isLiked', false);
  })

  test('createProduct - 입력 형식 오류', async () => {
    const spy = jest.spyOn(productRepository, 'createProduct');
    const token = jwt.sign({ userId: 'user-id' }, process.env.JWT_SECRET!);
    const response = await request(app).post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Product' });
    
    expect(spy).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', '입력 형식이 올바르지 않습니다.');
  })

  test('createProduct - 인증 실패', async () => {
    const spy = jest.spyOn(productRepository, 'createProduct');
    const response = await request(app).post('/products')
      .send({ name: 'New Product', price: 200, description: 'A new product', tag: 'FASHION' });

    expect(spy).toHaveBeenCalledTimes(0);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', '로그인이 필요합니다.');
  })
})
