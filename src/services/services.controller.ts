import CloudinaryService from '@app/common/cloudinary/cloudinary.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateDTO } from 'dtos/create.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ServicesService } from './services.service';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    protected readonly cloudinary: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addService(@Body() createDto: CreateDTO) {
    return this.servicesService.createService(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateService(@Param('id') id: string, @Body() createDto: CreateDTO) {
    return this.servicesService.updateService(id, createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    return await this.servicesService.delete(id);
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

  @Get(':id')
  async getServicebyId(@Param('id') id: string) {
    return this.servicesService.findOne({ _id: id });
  }
}
