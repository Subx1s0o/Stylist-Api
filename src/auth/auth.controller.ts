import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { loginDTO } from 'dtos/login.dto';
import { RefreshDTO } from 'dtos/refresh.dto';
import { AuthService } from './auth.service';
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
}
