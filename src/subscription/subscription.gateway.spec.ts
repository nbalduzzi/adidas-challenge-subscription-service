import { HttpException, HttpService } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { SubscriptionGateway } from './subscription.gateway';

describe('SubscriptionGateway', () => {
  let subscriptionGateway: SubscriptionGateway;
  let httpService: HttpService;

  beforeEach(() => {
    httpService = new HttpService();
    subscriptionGateway = new SubscriptionGateway(httpService);
    process.env = {
      ...process.env,
      SECRET: 'someSecret',
      EMAIL_SERVICE_URL: 'http://someurl.com',
    };
  });

  describe('send email', () => {
    describe('on success http service', () => {
      it('should return 200', async () => {
        jest.spyOn(httpService, 'put').mockImplementationOnce(() =>
          of({
            data: undefined,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          }),
        );

        expect(await subscriptionGateway.sendEmail('someEmail')).toEqual(
          undefined,
        );
      });
    });

    describe('on fail http service', () => {
      it('should throw error', async () => {
        jest.spyOn(httpService, 'put').mockReturnValue(
          throwError(
            new HttpException(
              {
                status: 500,
                data: { message: 'Internal Server Error' },
              },
              500,
            ),
          ),
        );

        try {
          await subscriptionGateway.sendEmail('someEmail');
        } catch (e) {
          expect(e.message).toEqual('Internal Server Error');
        }
      });
    });
  });
});
