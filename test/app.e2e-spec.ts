/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/scrape/rules (GET)', () => {
    it('should return available rules', () => {
      return request(app.getHttpServer())
        .get('/scrape/rules')
        .expect(200)
        .expect((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body).toContain('linkedinJobPositions');
        });
    });
  });

  describe('/scrape (POST)', () => {
    it('should return error for invalid rule', () => {
      return request(app.getHttpServer())
        .post('/scrape')
        .send({
          url: 'https://example.com',
          ruleName: 'invalidRule',
        })
        .expect(400)
        .expect((response) => {
          expect(response.body.success).toBe(false);
          expect(response.body.error).toContain('Rule not found');
        });
    });

    it('should return error for invalid URL', () => {
      return request(app.getHttpServer())
        .post('/scrape')
        .send({
          url: 'invalid-url',
          ruleName: 'linkedinJobPositions',
        })
        .expect(400);
    });

    it('should handle missing parameters', () => {
      return request(app.getHttpServer()).post('/scrape').send({}).expect(400);
    });
  });
});
