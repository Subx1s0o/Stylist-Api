import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async findAll(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    const documents = await this.model.find();
    if (!documents) {
      this.logger.warn('Documents was not found with filterQuery', filterQuery);
      throw new NotFoundException('Documents was not found');
    }
    return documents;
  }

  async deleteOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOneAndDelete(filterQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Documents was not found with filterQuery', filterQuery);
      throw new NotFoundException('Documents was not found');
    }
    return document;
  }
}
