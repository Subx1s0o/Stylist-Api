import CloudinaryService from '@app/common/cloudinary/cloudinary.service';
import AbstractRepository from '@app/common/database/abstract.repository';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDTO } from 'dtos/create.dto';
import { Model } from 'mongoose';
import Translations from 'utils/translations';
import { ServicesDocument } from './services.schema';

@Injectable()
export class ServicesService extends AbstractRepository<ServicesDocument> {
  constructor(
    @InjectModel(ServicesDocument.name)
    protected readonly model: Model<ServicesDocument>,
    protected readonly cloudinary: CloudinaryService,
    protected readonly translations: Translations,
  ) {
    super(model);
  }

  async createService(data: CreateDTO): Promise<ServicesDocument> {
    const fieldsToTranslate = {
      title: data.title,
      result: data.result,
      attention: data.attention,
      duration_consultation: data.duration_consultation,
      duration_work: data.duration_work,
    };

    const translatedFields = await this.translations.translateFields(
      fieldsToTranslate,
      {},
    );

    let translatedStages = {};

    if (Object.keys(data.stages).length > 0) {
      translatedStages = await this.translations.translateStages(data.stages);
    }

    const newService = {
      ...translatedFields,
      price: data.price,
      format: data.format,
      category: data.category,
      stages: translatedStages,
      image: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdService = await this.model.create(newService);

    try {
      const uploadResult = await this.cloudinary.uploadPhoto(
        data.image,
        createdService._id.toString(),
        'services',
      );

      createdService.image = uploadResult.secure_url;
      await createdService.save();
    } catch (error) {
      throw new InternalServerErrorException('Error uploading file');
    }

    return createdService;
  }

  async updateService(
    id: string,
    data: Partial<CreateDTO>,
  ): Promise<ServicesDocument> {
    const existingService = await this.model.findById(id);
    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    const fieldsToTranslate = {
      title: data.title,
      result: data.result,
      attention: data.attention,
      duration_consultation: data.duration_consultation,
      duration_work: data.duration_work,
    };

    const translatedFields = await this.translations.translateFields(
      fieldsToTranslate,
      existingService,
    );

    let translatedStages = {};

    if (Object.keys(data.stages).length > 0) {
      translatedStages = await this.translations.translateStages(data.stages);
    }

    const updatedService: any = {
      ...existingService.toObject(),
      ...translatedFields,
      price: data.price,
      format: data.format,
      stages: translatedStages,
      updatedAt: new Date(),
    };

    if (data.image) {
      if (existingService.image) {
        const publicId = existingService.image
          .split('/')
          .pop()
          ?.split('.')
          .shift();

        const fileName = `services/${publicId}`;

        if (fileName) {
          await this.cloudinary.deletePhoto(fileName);
        }
      }

      try {
        const uploadResult = await this.cloudinary.uploadPhoto(
          data.image,
          id,
          'services',
        );

        updatedService.image = uploadResult.secure_url;
      } catch (error) {
        throw new InternalServerErrorException('Error uploading file');
      }
    }

    const updated = await this.model.findByIdAndUpdate(id, updatedService, {
      new: true,
    });

    if (!updated) {
      throw new InternalServerErrorException('Error updating service');
    }

    return updated;
  }

  async delete(id: string) {
    const existingService = await this.model.findById(id).lean().exec();
    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    const publicId = existingService.image.split('/').pop()?.split('.').shift();
    const fileName = `services/${publicId}`;

    await this.cloudinary.deletePhoto(fileName);
    await this.deleteOne({ _id: id });
  }
}
