import { Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { ContactsController } from './contacts.controller';

@Module({
  imports: [AdminModule],
  controllers: [ContactsController],
})
export class ContactsModule {}
