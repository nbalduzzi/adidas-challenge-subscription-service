import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EmailStatus } from './subscription.model';

export type SubscriptionDocument = Subscription & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (_, ret) {
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Subscription {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  gender: string;

  @Prop({ required: true })
  dateOfBirth: string;

  @Prop({ default: false })
  consent: boolean;

  @Prop({ enum: ['PENDING', 'SENT', 'ERROR'], default: 'PENDING' })
  emailNotificationStatus: EmailStatus;

  @Prop({ required: true })
  newsletterId: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
