import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordDTO } from 'dtos/changePassword.dto';
import { loginDTO } from 'dtos/login.dto';
import { RefreshDTO } from 'dtos/refresh.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() { refreshToken }: RefreshDTO) {
    return this.authService.refresh(refreshToken);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: loginDTO) {
    return this.authService.login(data);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(@Body() data: ChangePasswordDTO, @Req() req: Request) {
    return await this.authService.changePassword(data, req['jwt_payload'].id);
  }

  @Get('logged')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async isLogged(@Req() req: Request) {
    return await this.authService.isLogged(req['jwt_payload'].id);
  }
}
