import { Body, Controller, Post } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { AdminService } from 'src/admin/admin.service';
import { Context, Telegraf } from 'telegraf';

@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly adminService: AdminService,
    @InjectBot() private bot: Telegraf<Context>,
  ) {}

  @Post()
  async sendFormData(@Body() data) {
    const chatIds = await this.adminService.findAllChatIds();

    chatIds.map(async (chatId) => {
      await this.bot.telegram.sendMessage(
        chatId,
        `
        Привіт, тобі надіслали нове повідомлення!\n\nІм'я:${data.name}\nЕмейл:${data.email}\nСоц. Мережа:${data.link}`,
      );
    });
  }
}
