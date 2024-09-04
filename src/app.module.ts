import { DatabaseModule } from '@app/common/database/database.module';
import { Module } from '@nestjs/common';
import { ServicesModule } from './services/services.module';
@Module({
  imports: [DatabaseModule, ServicesModule],
})
export class AppModule {}
