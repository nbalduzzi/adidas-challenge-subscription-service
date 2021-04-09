import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionGateway } from './subscription.gateway';
import { CreateSubscriptionDTO, SubscriptionDTO } from './subscription.model';

describe('SubscriptionController', () => {
  let subscriptionController: SubscriptionController;
  let subscriptionService: SubscriptionService;
  let subscriptionGateway: SubscriptionGateway;

  beforeEach(() => {
    subscriptionService = new SubscriptionService(null);
    subscriptionGateway = new SubscriptionGateway(null);
    subscriptionController = new SubscriptionController(
      subscriptionService,
      subscriptionGateway,
    );
  });

  describe('get all subscription', () => {
    it('should return []', async () => {
      jest
        .spyOn(subscriptionService, 'getAllSubscriptions')
        .mockImplementation(() => Promise.resolve({ count: 0, results: [] }));

      expect(await subscriptionController.getAllSubscriptions()).toEqual({
        count: 0,
        results: [],
      });
    });
  });

  describe('get subscription detail', () => {
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
        .spyOn(subscriptionService, 'getSubscription')
        .mockImplementation(() => Promise.resolve(subscription));

      expect(await subscriptionController.getSubscription('someId')).toEqual(
        subscription,
      );
    });
  });

  describe('create subscription', () => {
    describe('on send mail event success', () => {
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
          .spyOn(subscriptionService, 'addSubscription')
          .mockImplementation(() => Promise.resolve(subscription));

        jest
          .spyOn(subscriptionService, 'updateEmailNotificationStatus')
          .mockImplementation(() => Promise.resolve(subscription));

        jest
          .spyOn(subscriptionGateway, 'sendEmail')
          .mockImplementation(() => Promise.resolve());

        expect(
          await subscriptionController.addSubscription(subscriptionRequest),
        ).toEqual(subscription);
      });
    });

    describe('on send mail event fail', () => {
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
          .spyOn(subscriptionService, 'addSubscription')
          .mockImplementation(() => Promise.resolve(subscription));

        jest
          .spyOn(subscriptionService, 'updateEmailNotificationStatus')
          .mockImplementation(() => Promise.resolve(subscription));

        jest
          .spyOn(subscriptionGateway, 'sendEmail')
          .mockImplementation(() => Promise.reject());

        expect(
          await subscriptionController.addSubscription(subscriptionRequest),
        ).toEqual(subscription);
      });
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
        .spyOn(subscriptionService, 'cancelSubscription')
        .mockImplementation(() => Promise.resolve(subscription));

      expect(await subscriptionController.cancelSubscription('someId')).toEqual(
        subscription,
      );
    });
  });
});
