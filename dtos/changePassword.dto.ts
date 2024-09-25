import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  new_password: string;

  @IsString()
  @IsNotEmpty()
  old_password: string;
}
