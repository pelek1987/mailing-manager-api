import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { RegisterUserResponse, User } from 'src/types/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private async findOne(username: string) {
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    newUser.firstname = firstname;
    newUser.lastname = lastname;
    newUser.username = username;
    newUser.pwdHash = hashedPassword;

    await newUser.save();

    return {
      id: newUser.id,
      username: newUser.username,
    };
  }
}
