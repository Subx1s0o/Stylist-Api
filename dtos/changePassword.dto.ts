import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDTO {
  @ApiProperty({
    description: 'Enter the new password',
    example: 'MisterSmith20',
  })
  @IsString()
  @IsNotEmpty()
  old_password: string;

  @ApiProperty({
    description: 'Enter the new password',
    example: 'MisterPassword25',
  })
  @IsString()
  @IsNotEmpty()
  new_password: string;
}
