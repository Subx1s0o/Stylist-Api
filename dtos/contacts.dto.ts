import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ContactsDTO {
  @ApiProperty({
    description: 'Enter the name of sender',
    example: 'Jira',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Enter the email of sender',
    example: 'IncredibleEmail@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Enter the social link of sender',
    example: '@Telegram',
  })
  @IsString()
  @IsOptional()
  link: string;
}
