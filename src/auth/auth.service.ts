import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDTO } from 'dtos/changePassword.dto';
import { loginDTO } from 'dtos/login.dto';
import { Model } from 'mongoose';
import { InjectBot } from 'nestjs-telegraf';
import { Admin } from 'src/admin/admin.schema';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    @InjectBot() private bot: Telegraf<Context>,
  ) {}

  async refresh(refreshToken: string) {
    let admin;
    try {
      admin = await this.jwtService.verify(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Refresh token is wrong or expired');
    }

    const accessToken = this.jwtService.sign(
      { id: admin.id },
      { expiresIn: '15m' },
    );
    return { accessToken };
  }

  async login(data: loginDTO) {
    const admin = await this.adminModel.findOne({ username: data.login });
    if (!admin) throw new UnauthorizedException('Wrong login or password');

    const validPassword = await bcrypt.compare(data.password, admin.password);
    if (!validPassword)
      throw new UnauthorizedException('Wrong login or password');

    const accessToken = this.jwtService.sign(
      { id: admin._id },
      { expiresIn: '30m' },
    );
    const refreshToken = this.jwtService.sign(
      { id: admin._id },
      { expiresIn: '5d' },
    );

    return { accessToken, refreshToken };
  }

  async changePassword(data: ChangePasswordDTO, id: string) {
    const admin = await this.adminModel.findById(id);

    if (!admin) throw new UnauthorizedException('Token is wrong or expired');

    const valid = await bcrypt.compare(data.old_password, admin.password);

    if (!valid)
      throw new BadRequestException(
        'The old password is wrong, please enter another',
      );

    const isSamePassword = await bcrypt.compare(
      data.new_password,
      admin.password,
    );
    if (isSamePassword) {
      throw new BadRequestException(
        'The new password cannot be the same as the old password',
      );
    }

    const hashedPassword = await bcrypt.hash(data.new_password, 10);
    admin.password = hashedPassword;

    const chatIds = admin.chatIds;
    await Promise.all(
      chatIds.map(async (chatId) => {
        await this.bot.telegram.sendMessage(
          chatId,
          `<b>Увага!!!</b>, Пароль було змінено, будь ласка перезапустіть бота командою <b>/start</b> та авторизуйтеся ще раз.`,
          { parse_mode: 'HTML' },
        );
      }),
    );

    admin.chatIds = [];
    await admin.save();

    throw new HttpException(
      { status: HttpStatus.OK, message: 'Password was successfully changed' },
      HttpStatus.OK,
    );
  }
}
