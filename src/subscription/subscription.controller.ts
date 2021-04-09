import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { SubscriptionGateway } from './subscription.gateway';
import { ISubscriptionController } from './subscription.interface';
import {
  CreateSubscriptionDTO,
  EmailStatus,
  PagedResults,
  SubscriptionDTO,
} from './subscription.model';

@Controller('subscriptions')
@ApiBearerAuth('Authorization')
@ApiTags('subscriptions')
export class SubscriptionController implements ISubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly subscriptionGateway: SubscriptionGateway,
  ) {}

  @Post()
  @ApiResponse({ type: SubscriptionDTO, status: 201 })
  @ApiBody({
    required: true,
    type: CreateSubscriptionDTO,
  })
  async addSubscription(
    @Body() subscription: CreateSubscriptionDTO,
  ): Promise<SubscriptionDTO> {
    const createdSubscription: SubscriptionDTO = await this.subscriptionService.addSubscription(
      subscription,
    );

    if (createdSubscription.consent) {
      this.subscriptionGateway
        .sendEmail(createdSubscription.email)
        .then(async () => {
          await this.subscriptionService.updateEmailNotificationStatus(
            createdSubscription.id,
            EmailStatus.SENT,
          );
        })
        .catch(async () => {
          await this.subscriptionService.updateEmailNotificationStatus(
            createdSubscription.id,
            EmailStatus.ERROR,
          );
        });
    }

    return createdSubscription;
  }

  @Get()
  @ApiResponse({ type: PagedResults, status: 200 })
  @ApiQuery({ name: 'page', type: Number, required: false })
  async getAllSubscriptions(
    @Query('page') page?: number,
  ): Promise<PagedResults<SubscriptionDTO>> {
    return await this.subscriptionService.getAllSubscriptions(page);
  }

  @Delete('/:id')
  @ApiResponse({ type: SubscriptionDTO, status: 200 })
  @ApiParam({
    required: true,
    allowEmptyValue: false,
    type: String,
    name: 'id',
  })
  async cancelSubscription(@Param('id') id: string): Promise<SubscriptionDTO> {
    return await this.subscriptionService.cancelSubscription(id);
  }

  @Get('/:id')
  @ApiResponse({ type: SubscriptionDTO, status: 200 })
  @ApiParam({
    required: true,
    allowEmptyValue: false,
    type: String,
    name: 'id',
  })
  async getSubscription(@Param('id') id: string): Promise<SubscriptionDTO> {
    return await this.subscriptionService.getSubscription(id);
  }
}
