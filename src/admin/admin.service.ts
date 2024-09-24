import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { Admin } from './admin.schema';
@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
  ) {}

  async authenticate(
    username: string,
    password: string,
    chatId: number,
  ): Promise<Admin | null> {
    const admin = await this.adminModel.findOne({ username }).exec();

    if (!admin) return null;

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) return null;

    if (!admin.chatIds.includes(chatId)) {
      admin.chatIds.push(chatId);
      await admin.save();
    }
    return admin;
  }

  async isAuthorized(chatId: number): Promise<boolean> {
    const admin = await this.adminModel.findOne({ chatIds: chatId }).exec();
    return admin ? true : false;
  }

  async findAllChatIds(): Promise<number[]> {
    const admin = await this.adminModel.findOne().exec();
    return admin ? admin.chatIds : [];
  }
}
