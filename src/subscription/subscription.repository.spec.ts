import { Test } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { disconnect, Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  EmailStatus,
  PagedResults,
  SubscriptionDTO,
} from './subscription.model';
import { SubscriptionRepository } from './subscription.repository';
import {
  Subscription,
  SubscriptionDocument,
  SubscriptionSchema,
} from './subscription.schema';

describe('SubscriptionRepository', () => {
  let mongod: MongoMemoryServer;
  let subscriptionModel: Model<SubscriptionDocument>;
  let subscriptionRepository: SubscriptionRepository;

  afterEach(async () => {
    await disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    mongod = new MongoMemoryServer();

    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: await mongod.getUri(),
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
          }),
        }),
        MongooseModule.forFeature([
          { name: Subscription.name, schema: SubscriptionSchema },
        ]),
      ],
      providers: [SubscriptionRepository],
    }).compile();

    subscriptionModel = moduleRef.get(getModelToken(Subscription.name));

    subscriptionRepository = moduleRef.get<SubscriptionRepository>(
      SubscriptionRepository,
    );
  });

  describe('get all subscription', () => {
    describe('on find method success', () => {
      it('should return documents array', async () => {
        const subscription: SubscriptionDTO = {
          firstName: 'SomeName',
          email: 'some@email.com',
          gender: 'male',
          consent: false,
          dateOfBirth: new Date().toISOString(),
          emailNotificationStatus: EmailStatus.PENDING,
          newsletterId: 'someNewsletterId',
        };

        const subscriptionCreated: SubscriptionDTO = await subscriptionRepository.addSubscription(
          subscription,
        );

        const {
          count,
          results,
        }: PagedResults<SubscriptionDTO> = await subscriptionRepository.getAllSubscriptions();

        expect(count).toEqual(1);
        expect(results.length).toEqual(1);
        await subscriptionRepository.cancelSubscription(subscriptionCreated.id);
      });
    });

    describe('on find method fails', () => {
      it('should throw error', async () => {
        jest
          .spyOn(subscriptionModel, 'find')
          .mockRejectedValue(() => Promise.reject());

        try {
          await subscriptionRepository.getAllSubscriptions();
        } catch (e) {
          expect(e.message).toEqual('error ocurred on get all subscription');
        }
      });
    });
  });

  describe('get subscription detail', () => {
    describe('on findOne method success', () => {
      it('should return the subscription', async () => {
        const subscription: SubscriptionDTO = {
          firstName: 'SomeName',
          email: 'some@email.com',
          gender: 'male',
          consent: false,
          dateOfBirth: new Date().toISOString(),
          emailNotificationStatus: EmailStatus.PENDING,
          newsletterId: 'someNewsletterId',
        };

        const subscriptionCreated: SubscriptionDTO = await subscriptionRepository.addSubscription(
          subscription,
        );

        const subscriptionFound: SubscriptionDTO = await subscriptionRepository.getSubscription(
          subscriptionCreated.id,
        );

        expect(subscriptionFound.id).toBeDefined();
        expect(subscriptionFound.createdAt).toBeDefined();
        expect(subscriptionFound.updatedAt).toBeDefined();
        expect(subscriptionFound.email).toEqual(subscription.email);
        await subscriptionRepository.cancelSubscription(subscriptionCreated.id);
      });
    });

    describe('on find method fails', () => {
      it('should throw error', async () => {
        jest
          .spyOn(subscriptionModel, 'findOne')
          .mockRejectedValue(() => Promise.reject());

        try {
          await subscriptionRepository.getSubscription('');
        } catch (e) {
          expect(e.message).toEqual('error ocurred on get subscription');
        }
      });
    });
  });

  describe('cancel subscription', () => {
    describe('on findOne method success', () => {
      it('should delete the subscription', async () => {
        const subscription: SubscriptionDTO = {
          firstName: 'SomeName',
          email: 'some@email.com',
          gender: 'male',
          consent: false,
          dateOfBirth: new Date().toISOString(),
          emailNotificationStatus: EmailStatus.PENDING,
          newsletterId: 'someNewsletterId',
        };

        const subscriptionCreated: SubscriptionDTO = await subscriptionRepository.addSubscription(
          subscription,
        );

        const subscriptionCanceled: SubscriptionDTO = await subscriptionRepository.cancelSubscription(
          subscriptionCreated.id,
        );

        expect(subscriptionCanceled.id).toBeDefined();
        expect(subscriptionCanceled.createdAt).toBeDefined();
        expect(subscriptionCanceled.updatedAt).toBeDefined();
        expect(subscriptionCanceled.id).toEqual(subscriptionCreated.id);

        expect(
          await subscriptionRepository.getSubscription(subscriptionCanceled.id),
        ).toBeUndefined();
      });
    });

    describe('on find method fails', () => {
      it('should throw error', async () => {
        jest
          .spyOn(subscriptionModel, 'findOne')
          .mockRejectedValue(() => Promise.reject());

        try {
          await subscriptionRepository.cancelSubscription('');
        } catch (e) {
          expect(e.message).toEqual('error ocurred on cancel subscription');
        }
      });
    });
  });

  describe('create subscription', () => {
    describe('on create method success', () => {
      it('should return the subscription created', async () => {
        const subscription: SubscriptionDTO = {
          firstName: 'SomeName',
          email: 'some@email.com',
          gender: 'male',
          consent: false,
          dateOfBirth: new Date().toISOString(),
          emailNotificationStatus: EmailStatus.PENDING,
          newsletterId: 'someNewsletterId',
        };

        const subscriptionCreated: SubscriptionDTO = await subscriptionRepository.addSubscription(
          subscription,
        );

        expect(subscriptionCreated.id).toBeDefined();
        expect(subscriptionCreated.createdAt).toBeDefined();
        expect(subscriptionCreated.updatedAt).toBeDefined();
        await subscriptionRepository.cancelSubscription(subscriptionCreated.id);
      });
    });

    describe('on find method fails', () => {
      it('should throw error', async () => {
        const subscription: SubscriptionDTO = {
          firstName: 'SomeName',
          email: 'some@email.com',
          gender: 'male',
          consent: false,
          dateOfBirth: new Date().toISOString(),
          emailNotificationStatus: EmailStatus.PENDING,
          newsletterId: 'someNewsletterId',
        };

        jest
          .spyOn(subscriptionModel, 'create')
          .mockImplementation(() => Promise.reject());

        try {
          await subscriptionRepository.addSubscription(subscription);
        } catch (e) {
          expect(e.message).toEqual('error ocurred on add subscription');
        }
      });
    });
  });

  describe('update subscription email notification status', () => {
    describe('on updateOne method success', () => {
      it('should return the subscription updated', async () => {
        const subscription: SubscriptionDTO = {
          firstName: 'SomeName',
          email: 'some@email.com',
          gender: 'male',
          consent: false,
          dateOfBirth: new Date().toISOString(),
          emailNotificationStatus: EmailStatus.PENDING,
          newsletterId: 'someNewsletterId',
        };

        const subscriptionCreated: SubscriptionDTO = await subscriptionRepository.addSubscription(
          subscription,
        );

        expect(subscriptionCreated.id).toBeDefined();
        expect(subscriptionCreated.createdAt).toBeDefined();
        expect(subscriptionCreated.updatedAt).toBeDefined();

        const subscriptionUpdated: SubscriptionDTO = await subscriptionRepository.updateEmailNotificationStatus(
          subscriptionCreated.id,
          EmailStatus.SENT,
        );

        expect(subscriptionUpdated.id).toBeDefined();
        expect(subscriptionUpdated.createdAt).toBeDefined();
        expect(subscriptionUpdated.updatedAt).toBeDefined();
        expect(subscriptionUpdated.id).toEqual(subscriptionCreated.id);
        expect(subscriptionUpdated.emailNotificationStatus).not.toEqual(
          subscriptionCreated.emailNotificationStatus,
        );
        expect(subscriptionUpdated.emailNotificationStatus).toEqual(
          EmailStatus.SENT,
        );

        await subscriptionRepository.cancelSubscription(subscriptionCreated.id);
      });
    });

    describe('on find method fails', () => {
      it('should throw error', async () => {
        jest
          .spyOn(subscriptionModel, 'updateOne')
          .mockRejectedValue(() => Promise.reject());

        try {
          await subscriptionRepository.updateEmailNotificationStatus(
            '',
            EmailStatus.SENT,
          );
        } catch (e) {
          expect(e.message).toEqual(
            'error ocurred on update email notification status',
          );
        }
      });
    });
  });
});
