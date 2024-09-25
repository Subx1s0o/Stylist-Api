import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { loginDTO } from 'dtos/login.dto';
import { Model } from 'mongoose';
import { Admin } from 'src/admin/admin.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
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
      { expiresIn: '15m' },
    );
    const refreshToken = this.jwtService.sign(
      { id: admin._id },
      { expiresIn: '3d' },
    );

    return { accessToken, refreshToken };
  }
}
