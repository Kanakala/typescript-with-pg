import { User } from '../models/user';
import logger from '../utils/logger';
import { sqlToDB } from '../utils/dbUtil';
import { isPasswordMatch } from '../utils/authUtil';

export class UserService {
  public async getUser(userId: string): Promise<User> {
    try {
      const userResult = await sqlToDB(`SELECT * FROM public.users WHERE id='${userId}'`, []);
      const [user] = userResult.rows;
      if (!user) {
        const err = 'User Not Found';
        logger.error(`err: ${err}`);
        throw Error(err);
      }
      return user;
    } catch (err) {
      logger.error(`err: ${err}`);
      throw err;
    }
  }

  public async getUserByEmail(email: string): Promise<User> {
    try {
      const userResult = await sqlToDB(`SELECT * FROM public.users WHERE LOWER(email)='${email.toLowerCase()}'`, []);
      const [user] = userResult.rows;
      return user;
    } catch (err) {
      logger.error(`err: ${err}`);
      throw err;
    }
  }

  public async loginUserWithEmailAndPassword(email: string, password: string): Promise<User> {
    try {
      const userResult = await sqlToDB(`SELECT * FROM public.users WHERE email='${email}'`, []);
      const [user] = userResult.rows;
      if (user && (await isPasswordMatch(user, password))) {
        return user;
      } else {
        const err = 'Incorrect email or password';
        logger.error(`err: ${err}`);
        throw Error(err);
      }
    } catch (err) {
      logger.error(`err: ${err}`);
      throw err;
    }
  }
}
