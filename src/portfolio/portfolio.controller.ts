import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import PortfolioDTO from 'dtos/portfolio.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addImage(@Body() { image }: PortfolioDTO) {
    return this.portfolioService.addImage(image);
  }

  @Get()
  async getImages(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.portfolioService.getAllImages({ page, limit });
  }

  @Delete()
  async deleteImage(@Query('id') id: string) {
    return this.portfolioService.deleteOne({ _id: id });
  }
}
