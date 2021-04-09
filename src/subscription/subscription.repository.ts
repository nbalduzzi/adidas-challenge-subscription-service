import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ISubscriptionRepository } from './subscription.interface';
import {
  CreateSubscriptionDTO,
  EmailStatus,
  PagedResults,
  SubscriptionDTO,
} from './subscription.model';
import { Subscription, SubscriptionDocument } from './subscription.schema';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async addSubscription(
    subscription: CreateSubscriptionDTO,
  ): Promise<SubscriptionDTO> {
    try {
      const subscriptionCreated: SubscriptionDocument = await this.subscriptionModel.create(
        { ...subscription, id: v4() },
      );

      return subscriptionCreated.toJSON();
    } catch (e) {
      throw new InternalServerErrorException(
        'error ocurred on add subscription',
      );
    }
  }

  async getAllSubscriptions(
    page?: number,
  ): Promise<PagedResults<SubscriptionDTO>> {
    try {
      const subscriptions: SubscriptionDocument[] = await this.subscriptionModel.find(
        {},
        undefined,
        { sort: { createdAt: -1 }, limit: 10, skip: (page || 0) * 10 },
      );

      return {
        count: await this.subscriptionModel.countDocuments(),
        results: subscriptions.map((s: SubscriptionDocument) => s.toJSON()),
      };
    } catch (e) {
      throw new InternalServerErrorException(
        'error ocurred on get all subscription',
      );
    }
  }

  async cancelSubscription(id: string): Promise<SubscriptionDTO> {
    try {
      const subscription: SubscriptionDocument = await this.subscriptionModel.findOne(
        { id },
      );

      await subscription.delete();
      return subscription.toJSON();
    } catch (e) {
      throw new InternalServerErrorException(
        'error ocurred on cancel subscription',
      );
    }
  }

  async getSubscription(id: string): Promise<SubscriptionDTO | undefined> {
    try {
      const subscription:
        | SubscriptionDocument
        | undefined = await this.subscriptionModel.findOne({ id });

      return subscription ? subscription.toJSON() : undefined;
    } catch (e) {
      throw new InternalServerErrorException(
        'error ocurred on get subscription',
      );
    }
  }

  async updateEmailNotificationStatus(
    id: string,
    status: EmailStatus,
  ): Promise<SubscriptionDTO> {
    try {
      await this.subscriptionModel.updateOne(
        { id },
        { $set: { emailNotificationStatus: status } },
      );

      return await this.getSubscription(id);
    } catch (e) {
      throw new InternalServerErrorException(
        'error ocurred on update email notification status',
      );
    }
  }
}
