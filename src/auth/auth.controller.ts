import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterUserResponse } from 'src/types/user';
import { UserService } from 'src/user/user.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { Response } from 'express';
import { LoginUsertDTO } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from 'src/decorators/user-obj.decorator';
import { UserEntity } from 'src/user/user.entity';

@Controller('app/auth')
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

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  async logoutUser(@UserObj() user: UserEntity, @Res() res: Response) {
    return this.authService.logout(user, res);
  }
}
