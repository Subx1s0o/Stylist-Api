import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty()
  price: number;

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
  attention?: string;
}
