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
  ) {
    super(model);
  }

  async getServicesByHref(href: string): Promise<ServicesDocument> {
    return this.findOne({ href });
  }

  async getServicesById(id: string): Promise<ServicesDocument> {
    return this.findOne({ _id: id });
  }

  private async translate(data: string): Promise<{ uk: string; en: string }> {
    try {
      const translations = await MET.translate(data, 'uk', 'en');
      const englishTranslation = translations[0]?.translations[0]?.text || data;
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

  async createService(data: CreateDTO): Promise<ServicesDocument> {
    const createTranslationMap = async (
      text: string,
    ): Promise<Map<string, string>> => {
      const translations = await this.translate(text);
      return new Map(Object.entries(translations));
    };
    const titleMap = await createTranslationMap(data.title);
    const resultMap = await createTranslationMap(data.result);
    const attentionMap = await createTranslationMap(data.attention);
    const durationConsultationMap = await createTranslationMap(
      data.duration_consultation,
    );
    const durationWorkMap = await createTranslationMap(data.duration_work);

    const newService = {
      title: titleMap,
      duration_consultation: durationConsultationMap,
      duration_work: durationWorkMap,
      price: data.price,
      format: data.format,
      result: resultMap,
      attention: attentionMap,
      href: `service-number`,
      category: data.category,
    };
    const createdService = await this.create(newService);
    return createdService;
  }
}
