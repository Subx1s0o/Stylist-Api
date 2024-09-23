import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum Format {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

enum Category {
  STYLE = 'style',
  MAKEUP = 'makeup',
}

export class CreateDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  duration_consultation: string;

  @IsString()
  @IsNotEmpty()
  duration_work: string;

  @IsNotEmpty()
  price: string;

  @IsEnum(Format)
  @IsNotEmpty()
  format: Format;

  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @IsString()
  @IsNotEmpty()
  result: string;

  @IsString()
  @IsOptional()
  attention?: string;

  @IsOptional()
  @IsString()
  stages?: string;
}
