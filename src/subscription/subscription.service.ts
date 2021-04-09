import { Injectable, NotFoundException } from '@nestjs/common';
import { ISubscriptionService } from './subscription.interface';
import {
  CreateSubscriptionDTO,
  EmailStatus,
  PagedResults,
  SubscriptionDTO,
} from './subscription.model';
import { SubscriptionRepository } from './subscription.repository';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async addSubscription(
    subscription: CreateSubscriptionDTO,
  ): Promise<SubscriptionDTO> {
    return await this.subscriptionRepository.addSubscription(subscription);
  }

  async getAllSubscriptions(
    page?: number,
  ): Promise<PagedResults<SubscriptionDTO>> {
    return await this.subscriptionRepository.getAllSubscriptions(page);
  }

  async cancelSubscription(id: string): Promise<SubscriptionDTO> {
    return await this.subscriptionRepository.cancelSubscription(id);
  }

  async getSubscription(id: string): Promise<SubscriptionDTO> {
    const subscription:
      | SubscriptionDTO
      | undefined = await this.subscriptionRepository.getSubscription(id);

    if (!subscription) throw new NotFoundException('subscription not found');

    return subscription;
  }

  async updateEmailNotificationStatus(
    id: string,
    status: EmailStatus,
  ): Promise<SubscriptionDTO> {
    return await this.subscriptionRepository.updateEmailNotificationStatus(
      id,
      status,
    );
  }
}
