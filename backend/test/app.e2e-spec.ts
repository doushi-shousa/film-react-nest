import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Film API (e2e)', () => {
  let app: INestApplication;

  const filmId = '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf';
  const sessionId = 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/afisha');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/afisha/films returns films', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/afisha/films')
      .expect(200);

    expect(response.body.total).toBeGreaterThan(0);
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  it('GET /api/afisha/films/:id/schedule returns schedule', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/afisha/films/${filmId}/schedule`)
      .expect(200);

    expect(response.body.total).toBeGreaterThan(0);
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  it('POST /api/afisha/order books a seat and blocks duplicate booking', async () => {
    const order = {
      email: 'test@example.com',
      phone: '+7 999 000-00-00',
      tickets: [
        {
          film: filmId,
          session: sessionId,
          daytime: '2024-06-28T10:00:53+03:00',
          row: 1,
          seat: 1,
          price: 350,
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/api/afisha/order')
      .send(order)
      .expect(200);

    expect(response.body.total).toBe(1);
    expect(response.body.items[0]).toEqual(
      expect.objectContaining({
        film: filmId,
        session: sessionId,
        row: 1,
        seat: 1,
      }),
    );
    expect(response.body.items[0].id).toEqual(expect.any(String));

    await request(app.getHttpServer())
      .post('/api/afisha/order')
      .send(order)
      .expect(400);
  });
});
