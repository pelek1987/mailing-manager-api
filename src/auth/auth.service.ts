import { Inject, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserEntity } from 'src/user/user.entity';
// import { hashPassword } from 'src/utils/hash-password';
import { LoginUsertDTO } from './dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}
  private createToken(currentTokenId: string): {
    accessToken: string;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  private async generateToken(user: UserEntity): Promise<string> {
    let token;
    let userWithThisToken = null;

    do {
      token = uuid();
      userWithThisToken = await UserEntity.findOne({
        where: {
          currentTokenId: token,
        },
      });
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();
    return token;
  }

  async login(req: LoginUsertDTO, res: Response): Promise<any> {
    try {
      const user = await this.userService.findOne(req.username);
      if (!user) {
        return res.json({
          error: 'Invalid login data',
        });
      }
      const token = await this.createToken(await this.generateToken(user));

      return res
        .cookie('access_token', token.accessToken, {
          secure: false,
          domain: 'localhost',
          httpOnly: true,
        })
        .json({ ok: true });
    } catch (err) {
      return res.json({
        error: err.message,
      });
    }
  }

  async logout(user: UserEntity, res: Response) {
    try {
      user.currentTokenId = null;
      await user.save();
      res.clearCookie('access_token', {
        secure: false,
        domain: 'localhost',
        httpOnly: true,
      });
      return res.json({ ok: true });
    } catch (err) {
      return res.json({
        error: err.message,
      });
    }
  }
}
