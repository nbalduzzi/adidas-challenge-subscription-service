import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AuthorizationMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASSWORD,
      dbName: process.env.MONGODB_DBNAME,
    }),
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes('cats');
  }
}
