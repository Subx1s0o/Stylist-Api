import { Injectable } from '@nestjs/common';
import { MET } from 'bing-translate-api';

@Injectable()
export default class Translations {
  async createTranslationMap(text: string): Promise<Map<string, string>> {
    const translations = await this.translate(text);
    return new Map(Object.entries(translations));
  }

  async translate(data: string): Promise<{ uk: string; en: string }> {
    try {
      const translations = await MET.translate(data, 'uk', 'en');
      const englishTranslation =
        translations[0]?.translations?.[0]?.text || data;
      return {
        uk: data,
        en: englishTranslation,
      };
    } catch (error) {
      return {
        uk: data,
        en: data,
      };
    }
  }

  async translateStages(
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

  async translateFields(
    fields: Record<string, string | undefined>,
    existingFields: Record<string, any>,
  ): Promise<Record<string, any>> {
    const translatedFields: Record<string, any> = {};

    for (const [key, value] of Object.entries(fields)) {
      translatedFields[key] = value
        ? await this.createTranslationMap(value)
        : existingFields[key];
    }

    return translatedFields;
  }
}
