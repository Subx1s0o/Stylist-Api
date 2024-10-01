import CloudinaryService from '@app/common/cloudinary/cloudinary.service';
import AbstractRepository from '@app/common/database/abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PortfolioDocument } from './portfolio.schema';

@Injectable()
export class PortfolioService extends AbstractRepository<PortfolioDocument> {
  constructor(
    @InjectModel(PortfolioDocument.name) model: Model<PortfolioDocument>,
    private readonly cloudinary: CloudinaryService,
  ) {
    super(model);
  }

  async addImage(image: string) {
    const document = await this.model.create({ image: '' });

    const uploaded_image = await this.cloudinary.uploadPhoto(
      image,
      document._id.toString(),
      'portfolio',
    );

    document.image = uploaded_image.secure_url;
    await document.save();
  }
}
