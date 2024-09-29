import { CloudinaryModule } from '@app/common/cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { PortfolioController } from './portfolio.controller';
import { PortfolioDocument, PortfolioSchema } from './portfolio.schema';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PortfolioDocument.name, schema: PortfolioSchema },
    ]),
    CloudinaryModule,
    AuthModule,
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService, JwtAuthGuard],
})
export class PortfolioModule {}
