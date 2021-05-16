import passport from 'passport';
import { Request, Response } from 'express';
import { User } from '../models/user';

const verifyCallback =  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req: Request, res: Response, resolve: any, reject: any, requiredRights: string[]) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (err: any, user: User, info: any) => {
    if (err || info || !user) {
      return res.status(401).send('Please authenticate');
    }
    req.user = user;

    if (requiredRights.length) {
      if (!requiredRights.includes(user.role)) {
        return res
          .status(401)
          .send('You do not have necessary permissions to do this action, Please Contact Administrator');
      }
    }

    resolve();
  };

export const auth =
  (requiredRights: string[]) =>
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  async (req: Request, res: Response, next: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Promise((resolve: any, reject: any) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, res, resolve, reject, requiredRights))(
        req,
        res,
        next,
      );
    })
      .then(() => next())
      .catch((err) => next(err));
  };
