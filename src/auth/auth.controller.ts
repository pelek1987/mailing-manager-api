import { Body, Controller, Inject, Post } from '@nestjs/common';
import { RegisterUserResponse } from 'src/types/user';
import { UserService } from 'src/user/user.service';
import { RegisterUserDTO } from './dto/register-user.dto';

@Controller('api/auth')
export class AuthController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Post('register')
  registerUser(
    @Body() newUser: RegisterUserDTO,
  ): Promise<RegisterUserResponse> {
    return this.userService.createUser(newUser);
  }
}
