import CloudinaryService from '@app/common/cloudinary/cloudinary.service';
import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MET } from 'bing-translate-api';
import { CreateDTO } from 'dtos/services.dtos';
import { Model } from 'mongoose';
import { ServicesDocument } from './services.schema';

@Injectable()
export class ServicesService extends AbstractRepository<ServicesDocument> {
  protected readonly logger = new Logger(ServicesService.name);

  constructor(
    @InjectModel(ServicesDocument.name)
    protected readonly model: Model<ServicesDocument>,
    protected readonly cloudinary: CloudinaryService,
  ) {
    super(model);
  }

  private async createTranslationMap(
    text: string,
  ): Promise<Map<string, string>> {
    const translations = await this.translate(text);
    return new Map(Object.entries(translations));
  }

  private async translate(data: string): Promise<{ uk: string; en: string }> {
    try {
      const translations = await MET.translate(data, 'uk', 'en');
      const englishTranslation =
        translations[0]?.translations?.[0]?.text || data;
      return {
        uk: data,
        en: englishTranslation,
      };
    } catch (error) {
      this.logger.error('Error translating text', error);
      return {
        uk: data,
        en: data,
      };
    }
  }

  private async translateStages(
    stages: Record<number, string> | undefined,
  ): Promise<Record<number, { uk: string; en: string }>> {
    const translatedStages: Record<number, { uk: string; en: string }> = {};

    if (!stages) {
      return translatedStages;
    }

    for (const [key, stage] of Object.entries(stages)) {
      const { uk, en } = await this.translate(stage);
      translatedStages[Number(key)] = { uk, en };
    }

    return translatedStages;
  }

  async createService(
    data: CreateDTO,
    file: Express.Multer.File,
  ): Promise<ServicesDocument> {
    const titleMap = await this.createTranslationMap(data.title);
    const resultMap = await this.createTranslationMap(data.result);
    const attentionMap = data.attention
      ? await this.createTranslationMap(data.attention)
      : undefined;
    const durationConsultationMap = await this.createTranslationMap(
      data.duration_consultation,
    );
    const durationWorkMap = await this.createTranslationMap(data.duration_work);
    const translatedStages = await this.translateStages(data.stages);

    const newService = {
      title: titleMap,
      duration_consultation: durationConsultationMap,
      duration_work: durationWorkMap,
      price: data.price,
      format: data.format,
      result: resultMap,
      attention: attentionMap,
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

        const imageUrl = uploadResult.url;
        createdService.imageUrl = imageUrl;
        await createdService.save();
      } catch (error) {
        this.logger.error('Error uploading file: ' + error.message);
        throw new Error('Error uploading file');
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
      throw new Error('Service not found');
    }

    const titleMap = data.title
      ? await this.createTranslationMap(data.title)
      : existingService.title;
    const resultMap = data.result
      ? await this.createTranslationMap(data.result)
      : existingService.result;
    const attentionMap = data.attention
      ? await this.createTranslationMap(data.attention)
      : existingService.attention;
    const durationConsultationMap = data.duration_consultation
      ? await this.createTranslationMap(data.duration_consultation)
      : existingService.duration_consultation;
    const durationWorkMap = data.duration_work
      ? await this.createTranslationMap(data.duration_work)
      : existingService.duration_work;
    const translatedStages = data.stages
      ? await this.translateStages(data.stages)
      : existingService.stages;

    const updatedService: any = {
      ...existingService.toObject(),
      title: titleMap,
      duration_consultation: durationConsultationMap,
      duration_work: durationWorkMap,
      price: data.price || existingService.price,
      format: data.format || existingService.format,
      result: resultMap,
      attention: attentionMap,
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

        updatedService.imageUrl = uploadResult.url;
      } catch (error) {
        this.logger.error('Error uploading file: ' + error.message);
        throw new Error('Error uploading file');
      }
    }

    const updated = await this.model.findByIdAndUpdate(id, updatedService, {
      new: true,
    });

    if (!updated) {
      throw new Error('Error updating service');
    }

    return updated;
  }
}
