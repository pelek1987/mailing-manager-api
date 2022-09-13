import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserEntity } from 'src/user/user.entity';
import { hashPassword } from 'src/utils/hash-password';
import { LoginUsertDTO } from './dto/login-user.dto';
import { JwtPayload } from './jwt.strategy';
import * as dotenv from 'dotenv';
import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
dotenv.config();

@Injectable()
export class AuthService {
  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(payload, process.env.JWT_SECRET, {
      expiresIn,
    });

    return {
      accessToken,
      expiresIn,
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
      const user = await UserEntity.findOne({
        where: {
          username: req.username,
          pwdHash: hashPassword(req.password),
        },
      });
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
}
