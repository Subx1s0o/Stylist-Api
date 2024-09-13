import { Logger, NotFoundException } from '@nestjs/common';
import { Document, FilterQuery, Model, Types } from 'mongoose';

export default abstract class AbstractRepository<TDocument extends Document> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  private removeVersionField(document: any): any {
    const { __v, ...rest } = document;
    return rest;
  }

  async create(document: Partial<Omit<TDocument, '_id'>>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return this.removeVersionField(
      (await createdDocument.save()).toJSON() as unknown as TDocument,
    );
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery).lean();
    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }
    return this.removeVersionField(document) as TDocument;
  }

  async findAll(
    filterQuery: FilterQuery<TDocument> = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    services: TDocument[];
    total: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [services, total] = await Promise.all([
        this.model.find(filterQuery).skip(skip).limit(limit).lean(),
        this.model.countDocuments(filterQuery),
      ]);

      if (services.length === 0) {
        this.logger.warn('No services found with the given filter query');
      }

      const totalPages = Math.ceil(total / limit);

      return {
        services: services.map(this.removeVersionField) as TDocument[],
        total,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error occurred while fetching services', error);
      throw new Error('An error occurred while fetching services');
    }
  }

  async deleteOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOneAndDelete(filterQuery).lean();
    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }
    return this.removeVersionField(document) as TDocument;
  }
}
