import { CloudinaryModule } from '@app/common/cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/admin/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
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
    AuthModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService, Translations, JwtAuthGuard],
})
export class ServicesModule {}
