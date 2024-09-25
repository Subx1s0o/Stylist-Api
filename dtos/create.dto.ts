import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Title of Service',
    example: 'Безкоштовна консультація',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Duration consultation of Service',
    example: '2 години',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  duration_consultation: string;

  @ApiProperty({
    description: 'Duration work of Service',
    example: '2 неділі',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  duration_work: string;

  @ApiProperty({
    description: 'Price of Service',
    example: '122',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    description: 'Format of Service',
    enum: Format,
    example: Format.ONLINE,
    required: true,
  })
  @IsEnum(Format)
  @IsNotEmpty()
  format: Format;

  @ApiProperty({
    description: 'Category of Service',
    enum: Category,
    example: Category.STYLE,
    required: true,
  })
  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @ApiProperty({
    description: 'Describing result from Service',
    example:
      'Ви будете знати набагато більше про свій можливий вигляд, а також про кольорову палітру яка підходить саме вам.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  result: string;

  @ApiProperty({
    description: 'Attention to this Service',
    example: 'Увага, послуга тільки для постійних клієнтів',
    required: false,
  })
  @IsString()
  @IsOptional()
  attention?: string;

  @ApiProperty({
    description: 'Need provide JSON string. Stages have numbers from 1 to 6',
    example: '{"1":"перший етап", "2":"другий етап"}',
    required: false,
  })
  @IsOptional()
  @IsString()
  stages?: string;
}
