import { CloudinaryModule } from '@app/common/cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Translations from 'utils/translations';
import { ServicesController } from './services.controller';
import { ServicesDocument, ServicesSchema } from './services.schema';
import { ServicesService } from './services.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServicesDocument.name, schema: ServicesSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService, Translations],
})
export class ServicesModule {}
