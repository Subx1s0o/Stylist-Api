import {
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { ContactsDTO } from 'dtos/contacts.dto';
import { InjectBot } from 'nestjs-telegraf';
import { AdminService } from 'src/admin/admin.service';
import { Context, Telegraf } from 'telegraf';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly adminService: AdminService,
    @InjectBot() private bot: Telegraf<Context>,
  ) {}

  @Post()
  async sendFormData(@Body() data: ContactsDTO) {
    try {
      const chatIds = await this.adminService.findAllChatIds();
      await Promise.all(
        chatIds.map(async (chatId) => {
          await this.bot.telegram.sendMessage(
            chatId,
            `<b>Привіт!</b> Тобі надіслали нове повідомлення!\n\n<b>Ім'я:</b> ${data.name}\n\n<b>Емейл:</b> ${data.email}\n\n${data.link ? `<b>Соц. Мережа:</b> ${data.link}` : ''}
            `,
            { parse_mode: 'HTML' },
          );
        }),
      );

      return {
        status: HttpStatus.CREATED,
        message: 'The request was successfully sended',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error while sending message, please try later.',
      );
    }
  }
}
