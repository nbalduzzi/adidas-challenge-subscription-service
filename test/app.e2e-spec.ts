import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  afterEach(() => moduleFixture.close());

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: `.env.development` }),
        MongooseModule.forRoot(process.env.MONGODB_URI, {
          useCreateIndex: true,
          useNewUrlParser: true,
          user: process.env.MONGODB_USER,
          pass: process.env.MONGODB_PASSWORD,
          dbName: process.env.MONGODB_DBNAME,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ping (GET)', () => {
    return request(app.getHttpServer())
      .get('/ping')
      .expect(200)
      .expect('Pong!');
  });
});
