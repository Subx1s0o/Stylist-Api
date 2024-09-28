import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { AdminModule } from 'src/admin/admin.module';
import { BotUpdate } from './bot.update';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        token: config.get<string>('TEST_TG_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    AdminModule,
  ],
  providers: [ConfigService, BotUpdate],
})
export class BotModule {}
