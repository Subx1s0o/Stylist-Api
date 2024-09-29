import { BotModule } from '@app/common';
import { DatabaseModule } from '@app/common/database/database.module';
import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { ServicesModule } from './services/services.module';

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';

import { PortfolioModule } from './portfolio/portfolio.module';
@Module({
  imports: [
    DatabaseModule,
    ServicesModule,
    BotModule,
    ContactsModule,
    AdminModule,
    AuthModule,
    PortfolioModule,
  ],
})
export class AppModule {}
