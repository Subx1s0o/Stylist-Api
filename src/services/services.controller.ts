import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateDTO } from 'dtos/services.dtos';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async addService(@Body() data: CreateDTO) {
    return this.servicesService.createService(data);
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
}
