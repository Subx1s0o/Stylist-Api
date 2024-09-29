import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class PortfolioDocument extends Document {
  @Prop({ type: String, required: true })
  image: string;
}

export const PortfolioSchema = SchemaFactory.createForClass(PortfolioDocument);
