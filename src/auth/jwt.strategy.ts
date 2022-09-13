import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export interface JwtPayload {
  id: string;
}

const cookieExtractor = (req: any) => {
  return req && req.cookies ? req.cookies?.access_token ?? null : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload, done: (err, user) => void) {
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }
    const user = await UserEntity.findOne({
      where: {
        currentTokenId: payload.id,
      },
    });
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
