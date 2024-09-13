import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
    const admin = await this.adminModel.findOne({ username, password }).exec();
    if (admin) {
      if (!admin.chatIds.includes(chatId)) {
        admin.chatIds.push(chatId);
        await admin.save();
      }
      return admin;
    }
    return null;
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
