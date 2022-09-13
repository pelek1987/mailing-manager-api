import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUsertDTO {
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
