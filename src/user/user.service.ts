import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { RegisterUserResponse, User } from 'src/types/user';
import { hashPassword } from 'src/utils/hash-password';

@Injectable()
export class UserService {
  async findOne(username: string) {
    return await UserEntity.findOne({
      where: {
        username,
      },
    });
  }

  async createUser(userData: User): Promise<RegisterUserResponse> {
    const newUser = new UserEntity();

    const { firstname, lastname, username, password } = userData;

    console.log(this.findOne(username));

    const user = await this.findOne(username);

    if (user) {
      throw new BadRequestException();
    }

    const hashedPassword = hashPassword(password);

    newUser.firstname = firstname;
    newUser.lastname = lastname;
    newUser.username = username;
    newUser.pwdHash = hashedPassword;

    await newUser.save();

    return true;
  }
}
