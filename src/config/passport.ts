import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from './config';
import { tokenTypes } from './constants';
import { UserService } from '../services/userService';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jwtVerify = async (payload: any, done: any) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const userService = new UserService();
    const user = await userService.getUser(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
