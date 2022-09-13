import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDTO {
  id?: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
