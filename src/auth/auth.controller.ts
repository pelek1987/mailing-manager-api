import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { RegisterUserResponse } from 'src/types/user';
import { UserService } from 'src/user/user.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { Response } from 'express';
import { LoginUsertDTO } from './dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(AuthService) private authService: AuthService,
  ) {}

  @Post('register')
  registerUser(
    @Body() newUser: RegisterUserDTO,
  ): Promise<RegisterUserResponse> {
    return this.userService.createUser(newUser);
  }

  @Post('login')
  loginUser(@Body() req: LoginUsertDTO, @Res() res: Response): Promise<any> {
    return this.authService.login(req, res);
  }
}
