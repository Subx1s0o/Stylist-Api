import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class PortfolioDTO {
  @ApiProperty({ title: 'Image', description: 'Add image to portfolio' })
  @IsString()
  @IsNotEmpty()
  image: string;
}
