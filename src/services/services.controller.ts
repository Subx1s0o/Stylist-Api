import CloudinaryService from '@app/common/cloudinary/cloudinary.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDTO } from 'dtos/services.dtos';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    protected readonly cloudinary: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async addService(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateDTO,
  ) {
    if (!file) {
      throw new BadRequestException('File is missing');
    }

    return this.servicesService.createService(createDto, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateService(
    @Param('id') id: string,
    @Body() createDto: CreateDTO,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.servicesService.updateService(id, createDto, file);
  }

  @Get('makeup')
  async getMakeupServices(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('format') format?: 'online' | 'offline',
  ) {
    const filter = { category: 'makeup', ...(format ? { format } : {}) };
    return this.servicesService.findAll(filter, page, limit);
  }

  @Get('style')
  async getStyleServices(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('format') format?: 'online' | 'offline',
  ) {
    const filter = { category: 'style', ...(format ? { format } : {}) };
    return this.servicesService.findAll(filter, page, limit);
  }

  @Get('makeup/:id')
  async getMakeUpServicebyId(@Param('id') id: string) {
    return this.servicesService.findOne({ _id: id });
  }
}
