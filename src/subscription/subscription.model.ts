import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsEmail,
  IsDateString,
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export enum EmailStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  ERROR = 'ERROR',
}

export class PagedResults<T> {
  @ApiProperty({
    description: 'The total elements',
    type: Number,
    example: 0,
  })
  count: number;

  @ApiProperty({
    description: 'The elements list',
  })
  results: T[];
}

export class SubscriptionDTO {
  @ApiProperty({
    description: 'The subscription ID',
    type: String,
    required: false,
    example: '307136a8-6607-45d8-8d5a-144be75eabe0',
  })
  id?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The subscriptor email',
    type: String,
    required: true,
    example: 'jhon.doe@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'The subscriptor first name',
    type: String,
    required: false,
    example: 'Jhon',
  })
  firstName?: string;

  @ApiProperty({
    description: 'The subscriptor gender',
    type: String,
    required: false,
    example: 'Male',
  })
  gender?: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'The subscriptor date of birth',
    type: String,
    required: true,
    example: '1986-12-28T00:00:00.000Z',
  })
  dateOfBirth: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'The subscriptor consent flag',
    type: Boolean,
    required: true,
    default: false,
  })
  consent: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The subscriptor newsletter campaign id',
    type: String,
    required: true,
    example: 'shoes_campaing_id',
  })
  newsletterId: string;

  @ApiProperty({
    description: 'The subscriptor email notification status',
    enum: [EmailStatus.PENDING, EmailStatus.SENT, EmailStatus.ERROR],
  })
  emailNotificationStatus?: EmailStatus;

  @ApiProperty({
    description: 'The subscription created date',
    type: String,
    example: '2021-01-08T20:08:20.296Z',
  })
  createdAt?: string;

  @ApiProperty({
    description: 'The subscription updated date',
    type: String,
    example: '2021-04-08T19:11:54.184Z',
  })
  updatedAt?: string;
}

export class CreateSubscriptionDTO extends OmitType(SubscriptionDTO, [
  'id',
  'emailNotificationStatus',
  'createdAt',
  'updatedAt',
]) {}
