import { BotModule } from '@app/common';
import { DatabaseModule } from '@app/common/database/database.module';
import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { ServicesModule } from './services/services.module';

import { AdminModule } from './admin/admin.module';
@Module({
  imports: [
    DatabaseModule,
    ServicesModule,
    BotModule,
    ContactsModule,
    AdminModule,
  ],
})
export class AppModule {}
