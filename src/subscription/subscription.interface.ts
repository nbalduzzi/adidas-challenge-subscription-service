import {
  CreateSubscriptionDTO,
  EmailStatus,
  PagedResults,
  SubscriptionDTO,
} from './subscription.model';

export interface ISubscriptionController {
  addSubscription(
    subscription: CreateSubscriptionDTO,
  ): Promise<SubscriptionDTO>;
  getAllSubscriptions(page?: number): Promise<PagedResults<SubscriptionDTO>>;
  cancelSubscription(id: string): Promise<SubscriptionDTO>;
  getSubscription(id: string): Promise<SubscriptionDTO>;
}

export interface ISubscriptionService {
  addSubscription(
    subscription: CreateSubscriptionDTO,
  ): Promise<SubscriptionDTO>;
  getAllSubscriptions(page?: number): Promise<PagedResults<SubscriptionDTO>>;
  cancelSubscription(id: string): Promise<SubscriptionDTO>;
  getSubscription(id: string): Promise<SubscriptionDTO>;
  updateEmailNotificationStatus(
    id: string,
    status: EmailStatus,
  ): Promise<SubscriptionDTO>;
}

export interface ISubscriptionRepository {
  addSubscription(
    subscription: CreateSubscriptionDTO,
  ): Promise<SubscriptionDTO>;
  getAllSubscriptions(page?: number): Promise<PagedResults<SubscriptionDTO>>;
  cancelSubscription(id: string): Promise<SubscriptionDTO>;
  getSubscription(id: string): Promise<SubscriptionDTO>;
  updateEmailNotificationStatus(
    id: string,
    status: EmailStatus,
  ): Promise<SubscriptionDTO>;
}

export interface ISubscriptionGateway {
  sendEmail(email: string): Promise<void>;
}
