import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesController } from './services.controller';
import { ServicesDocument, ServicesSchema } from './services.schema';
import { ServicesService } from './services.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServicesDocument.name, schema: ServicesSchema },
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
