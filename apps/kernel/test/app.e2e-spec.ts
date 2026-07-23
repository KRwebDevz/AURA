import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Kernel (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET) should attach X-Request-ID and return status', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-request-id']).toBeDefined();
        expect(res.body.name).toBe('AURA');
        expect(res.body.version).toBe('0.1.0');
        expect(res.body.environment).toBeDefined();
        expect(res.body.status).toBe('healthy');
        expect(typeof res.body.uptime).toBe('number');
        expect(typeof res.body.timestamp).toBe('string');
        expect(res.body.kernel).toEqual({
          state: 'RUNNING',
        });
      });
  });

  it('/ai/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/ai/health')
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-request-id']).toBeDefined();
        expect(res.body.provider).toBe('ollama');
        expect(res.body.status).toBeDefined();
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
