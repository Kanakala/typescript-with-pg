import jwt from 'jsonwebtoken';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import config from '../config/config';
import { tokenTypes } from '../config/constants';
import { User } from '../models/user';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateToken = (userId: string, expires: any, type: string, secret: any = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateAuthTokens = async (user: User): Promise<any> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  //   await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

export const isPasswordMatch = async (user: User, password: string): Promise<boolean> => {
  return bcrypt.compare(password, user.password);
};
