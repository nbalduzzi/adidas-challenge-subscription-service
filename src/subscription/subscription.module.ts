import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionGateway } from './subscription.gateway';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { Subscription, SubscriptionSchema } from './subscription.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionGateway, SubscriptionRepository],
})
export class SubscriptionModule {}
