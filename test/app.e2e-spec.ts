/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Sequelize } from 'sequelize-typescript';

describe('InsureTech API (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    sequelize = moduleFixture.get<Sequelize>(Sequelize);

    await app.init();
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  describe('/products (GET)', () => {
    it('should return all products with categories', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('price');
          expect(res.body[0]).toHaveProperty('category');
          expect(res.body[0].category).toHaveProperty('name');
        });
    });
  });

  describe('/plans (POST)', () => {
    it('should create a plan successfully', () => {
      return request(app.getHttpServer())
        .post('/plans')
        .send({
          userId: 1,
          productId: 1,
          quantity: 1,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('userId', 1);
          expect(res.body).toHaveProperty('productId', 1);
          expect(res.body).toHaveProperty('quantity', 1);
          expect(res.body).toHaveProperty('totalAmount');
          expect(res.body).toHaveProperty('pendingPolicies');
          expect(res.body.pendingPolicies).toHaveLength(1);
        });
    });

    it('should return 400 for invalid input', () => {
      return request(app.getHttpServer())
        .post('/plans')
        .send({
          userId: 'invalid',
          productId: 1,
          quantity: 0,
        })
        .expect(400);
    });
  });

  describe('/policies/activate (POST)', () => {
    let planId: number;
    let pendingPolicyId: number;

    beforeAll(async () => {
      const planResponse = await request(app.getHttpServer())
        .post('/plans')
        .send({
          userId: 2,
          productId: 2,
          quantity: 1,
        });

      planId = planResponse.body.id;
      pendingPolicyId = planResponse.body.pendingPolicies[0].id;
    });

    it('should activate a pending policy successfully', () => {
      return request(app.getHttpServer())
        .post('/policies/activate')
        .send({
          pendingPolicyId,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('policyNumber');
          expect(res.body).toHaveProperty('planId', planId);
          expect(res.body).toHaveProperty('userId', 2);
          expect(res.body).toHaveProperty('activatedAt');
        });
    });
  });

  describe('/policies (GET)', () => {
    it('should return all policies', () => {
      return request(app.getHttpServer())
        .get('/policies')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('id');
            expect(res.body[0]).toHaveProperty('policyNumber');
            expect(res.body[0]).toHaveProperty('user');
            expect(res.body[0]).toHaveProperty('product');
          }
        });
    });
  });
});
