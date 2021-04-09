import { NotFoundException } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import {
  CreateSubscriptionDTO,
  EmailStatus,
  SubscriptionDTO,
} from './subscription.model';
import { SubscriptionRepository } from './subscription.repository';

describe('SubscriptionService', () => {
  let subscriptionService: SubscriptionService;
  let subscriptionRepository: SubscriptionRepository;

  beforeEach(() => {
    subscriptionRepository = new SubscriptionRepository(null);
    subscriptionService = new SubscriptionService(subscriptionRepository);
  });

  describe('get all subscription', () => {
    it('should return []', async () => {
      jest
        .spyOn(subscriptionRepository, 'getAllSubscriptions')
        .mockImplementation(() => Promise.resolve({ count: 0, results: [] }));

      expect(await subscriptionService.getAllSubscriptions()).toEqual({
        count: 0,
        results: [],
      });
    });
  });

  describe('get subscription detail', () => {
    describe('on subscription exists', () => {
      it('should return the subscription object', async () => {
        const subscription: SubscriptionDTO = {
          consent: true,
          dateOfBirth: Date().toString(),
          email: 'some@email.com',
          firstName: 'Some Name',
          gender: 'Male',
          id: 'someId',
          newsletterId: 'someNewsletterId',
        };

        jest
          .spyOn(subscriptionRepository, 'getSubscription')
          .mockImplementation(() => Promise.resolve(subscription));

        expect(await subscriptionService.getSubscription('someId')).toEqual(
          subscription,
        );
      });
    });

    describe('on subscription not exists', () => {
      it('should throw 404 error', async () => {
        jest
          .spyOn(subscriptionRepository, 'getSubscription')
          .mockImplementation(() => Promise.resolve(undefined));

        try {
          await subscriptionService.getSubscription('someId');
        } catch (e) {
          expect(e instanceof NotFoundException).toBeTruthy;
        }
      });
    });
  });

  describe('create subscription', () => {
    it('should return the subscription created', async () => {
      const subscriptionRequest: CreateSubscriptionDTO = {
        consent: true,
        dateOfBirth: Date().toString(),
        email: 'some@email.com',
        firstName: 'Some Name',
        gender: 'Male',
        newsletterId: 'someNewsletterId',
      };

      const subscription: SubscriptionDTO = {
        ...subscriptionRequest,
        id: 'someId',
      };

      jest
        .spyOn(subscriptionRepository, 'addSubscription')
        .mockImplementation(() => Promise.resolve(subscription));

      expect(
        await subscriptionService.addSubscription(subscriptionRequest),
      ).toEqual(subscription);
    });
  });

  describe('cancel subscription', () => {
    it('should return the subscription cancelled', async () => {
      const subscription: SubscriptionDTO = {
        id: 'someId',
        consent: true,
        dateOfBirth: Date().toString(),
        email: 'some@email.com',
        firstName: 'Some Name',
        gender: 'Male',
        newsletterId: 'someNewsletterId',
      };

      jest
        .spyOn(subscriptionRepository, 'cancelSubscription')
        .mockImplementation(() => Promise.resolve(subscription));

      expect(await subscriptionService.cancelSubscription('someId')).toEqual(
        subscription,
      );
    });
  });

  describe('update email status', () => {
    it('should update the email status', async () => {
      const subscription: SubscriptionDTO = {
        id: 'someId',
        consent: true,
        dateOfBirth: Date().toString(),
        email: 'some@email.com',
        firstName: 'Some Name',
        gender: 'Male',
        newsletterId: 'someNewsletterId',
        emailNotificationStatus: EmailStatus.SENT,
      };

      jest
        .spyOn(subscriptionRepository, 'updateEmailNotificationStatus')
        .mockImplementation(() => Promise.resolve(subscription));

      const subscriptionUpdated: SubscriptionDTO = await subscriptionService.updateEmailNotificationStatus(
        'someId',
        EmailStatus.SENT,
      );

      expect(subscriptionUpdated.emailNotificationStatus).toEqual(
        EmailStatus.SENT,
      );
    });
  });
});
