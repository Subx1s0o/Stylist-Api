import { Injectable } from '@nestjs/common';
import { Action, Ctx, On, Start, Update } from 'nestjs-telegraf';
import { AdminService } from 'src/admin/admin.service';
import { Context, Markup } from 'telegraf';

@Injectable()
@Update()
export class BotUpdate {
  private chatState = new Map<
    number,
    'awaiting_username' | 'awaiting_password' | 'authorized' | null
  >();
  private chatTempUsername = new Map<number, string>();

  constructor(private readonly adminService: AdminService) {}

  @Start()
  async sayWelcome(@Ctx() ctx: Context) {
    ctx.reply(
      'Привіт Маруся, вітаю тебе!, це початок нашої плідної співпраці!😊',
      Markup.inlineKeyboard([
        Markup.button.callback('Авторизуватися', 'AUTH_COMMAND'),
      ]),
    );
  }

  @Action('AUTH_COMMAND')
  async startLogin(@Ctx() ctx: Context) {
    const chatId = ctx.from.id;
    await ctx.answerCbQuery();
    const isAuthorized = await this.adminService.isAuthorized(chatId);

    if (isAuthorized) {
      await ctx.reply('Ви вже авторизовані.');
      return;
    }

    this.chatState.set(chatId, 'awaiting_username');
    await ctx.reply('Введи у чат логін🤫');
  }

  @On('text')
  async handleText(@Ctx() ctx: Context) {
    const chatId = ctx.message.chat.id;
    const userText = ctx.text;

    const isAuthorized = await this.adminService.isAuthorized(chatId);

    if (!isAuthorized) {
      const state = this.chatState.get(chatId);

      if (state === 'awaiting_username') {
        this.chatTempUsername.set(chatId, userText);
        this.chatState.set(chatId, 'awaiting_password');
        await ctx.reply('Введи у чат пароль🫣');
      } else if (state === 'awaiting_password') {
        const username = this.chatTempUsername.get(chatId);
        const password = userText;

        const admin = await this.adminService.authenticate(
          username,
          password,
          chatId,
        );

        if (admin) {
          await ctx.reply(
            '<b>Успішно Авторизовано!</b>, Радий тебе бачити!, Сюди я буду надсилати тобі повідомлення з твого сайту), дочекайся цієї миті😊',
            { parse_mode: 'HTML' },
          );
          this.chatState.set(chatId, 'authorized');
        } else {
          await ctx.reply(
            'Помилка аутентифікації, спробуй ще раз🙁',
            Markup.inlineKeyboard([
              Markup.button.callback('Авторизуватися', 'AUTH_COMMAND'),
            ]),
          );
          this.chatState.delete(chatId);
          this.chatTempUsername.delete(chatId);
        }
      } else {
        await ctx.reply(
          'Будь ласка натисни кнопку для аутентифікації😊',
          Markup.inlineKeyboard([
            Markup.button.callback('Авторизуватися', 'AUTH_COMMAND'),
          ]),
        );
      }
    }
  }
}
