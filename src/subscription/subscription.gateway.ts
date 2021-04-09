import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { ISubscriptionGateway } from './subscription.interface';

@Injectable()
export class SubscriptionGateway implements ISubscriptionGateway {
  constructor(private readonly httpService: HttpService) {}

  async sendEmail(email: string): Promise<void> {
    try {
      await this.httpService
        .put(
          process.env.EMAIL_SERVICE_URL,
          { email },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();
    } catch (e) {
      throw new HttpException(e.response.data.message, e.response.status);
    }
  }

  private get token(): string {
    return sign(
      {
        origin: 'adidas-challenge-subscription-service',
        resource: '/emails',
        timestamp: Date.now(),
      },
      process.env.SECRET,
      { algorithm: 'HS256' },
    );
  }
}
