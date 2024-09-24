import { IsNotEmpty, IsString } from 'class-validator';

export class loginDTO {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
