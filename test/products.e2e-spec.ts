import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { Product } from '../src/products/entities/product.entity';

describe('Products (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        // configure a separate in-memory DB for tests
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Product],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET products initially empty', async () => {
    const res = await request(app.getHttpServer()).get('/products').expect(200);
    expect(res.body).toEqual([]);
  });

  it('/POST creates product', async () => {
    const dto = { name: 'Test', price: 12.5, stock: 5 };
    const res = await request(app.getHttpServer())
      .post('/products')
      .send(dto)
      .expect(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Test');
  });

  it('/PUT updates product', async () => {
    // create
    const create = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'X', price: 1, stock: 1 });
    const id = create.body.id;
    const update = await request(app.getHttpServer())
      .put(`/products/${id}`)
      .send({ price: 2 })
      .expect(200);
    expect(Number(update.body.price)).toBe(2);
  });

  it('/DELETE removes product', async () => {
    const create = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Del', price: 1, stock: 1 });
    const id = create.body.id;
    await request(app.getHttpServer()).delete(`/products/${id}`).expect(200);
    await request(app.getHttpServer()).get(`/products/${id}`).expect(404);
  });
});
