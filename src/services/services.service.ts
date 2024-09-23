import CloudinaryService from '@app/common/cloudinary/cloudinary.service';
import AbstractRepository from '@app/common/database/abstract.repository';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDTO } from 'dtos/services.dtos';
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

  async createService(
    data: CreateDTO,
    file: Express.Multer.File,
  ): Promise<ServicesDocument> {
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
    const translatedStages = await this.translations.translateStages(
      data.stages,
    );

    const newService = {
      ...translatedFields,
      price: Number(data.price),
      format: data.format,
      category: data.category,
      stages: translatedStages,
      imageUrl: '',
    };

    const createdService = await this.model.create(newService);

    if (file && file.buffer) {
      try {
        const uploadResult = await this.cloudinary.uploadServicePhoto(
          file,
          createdService._id.toString(),
          'services',
        );

        const imageUrl = uploadResult.secure_url;
        createdService.imageUrl = imageUrl;
        await createdService.save();
      } catch (error) {
        throw new InternalServerErrorException('Error uploading file');
      }
    }

    return createdService;
  }

  async updateService(
    id: string,
    data: Partial<CreateDTO>,
    file?: Express.Multer.File,
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
    const translatedStages = data.stages
      ? await this.translations.translateStages(data.stages)
      : existingService.stages;

    const updatedService: any = {
      ...existingService.toObject(),
      ...translatedFields,
      price: Number(data.price) || existingService.price,
      format: data.format || existingService.format,
      category: data.category || existingService.category,
      stages: translatedStages,
    };

    if (file && file.buffer) {
      if (existingService.imageUrl) {
        const publicId = existingService.imageUrl
          .split('/')
          .pop()
          ?.split('.')
          .shift();

        const fileName = `services/${publicId}`;

        if (fileName) {
          await this.cloudinary.deleteServicePhoto(fileName);
        }
      }

      try {
        const uploadResult = await this.cloudinary.uploadServicePhoto(
          file,
          id,
          'services',
        );

        updatedService.imageUrl = uploadResult.secure_url;
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
}
