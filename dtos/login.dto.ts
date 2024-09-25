import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class loginDTO {
  @ApiProperty({
    description: 'Enter the login',
    example: 'MisterSmith25',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    description: 'Enter the password',
    example: 'MisterPassword25',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
