import { validateOrReject } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { User } from '../models/user';
import logger from '../utils/logger';
import { sqlToDB } from '../utils/dbUtil';
import { generateAuthTokens } from '../utils/authUtil';
import { UserService } from '../services/userService';
import { ApiError } from '../utils/apiError';

export class UserController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async createUser(user: User): Promise<any> {
    try {
      await validateOrReject(user);
      user.password = await bcrypt.hash(user.password, 8);
      user.email = user.email.toLowerCase();
      const userService = new UserService();
      const existingUser = await userService.getUserByEmail(user.email);
      if (existingUser) {
        const err = {
          statusCode: 400,
          message: 'There is already an existing user with the given email!',
        };
        throw err;
      }

      await sqlToDB(
        `INSERT INTO public.users (${Object.keys(user).join(', ')}) VALUES (${Array.from(
          { length: Object.keys(user).length },
          (_, i) => `$${i + 1}`,
        ).join(', ')})`,
        Object.values(user),
      );
      const tokens = await generateAuthTokens(Object.assign(new User(), user));
      return { user, tokens };
    } catch (err) {
      logger.error(`err: ${err}`);
      throw new ApiError(err.statusCode || 400, err.message);
    }
  }

  public async updateUser(user: User, userId: string): Promise<User> {
    try {
      if (!userId) {
        const err = {
          statusCode: 400,
          message: 'Please provide userid',
        };
        throw err;
      }
      delete user.email;
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 8);
      }
      const userService = new UserService();
      const existingUser = await userService.getUser(userId);
      if (!existingUser) {
        const err = {
          statusCode: 400,
          message: 'user Doesnot exists',
        };
        throw err;
      }
      await sqlToDB(
        `UPDATE public.users SET ${Object.entries(user).map(
          ([key, value]) => `"${key.toLowerCase()}"='${value}'`,
        )} WHERE "id"='${userId}'`,
        [],
      );
      return { ...existingUser, ...user };
    } catch (err) {
      logger.error(`err: ${err}`);
      throw new ApiError(err.statusCode || 400, err.message);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async login(email: string, password: string): Promise<any> {
    try {
      const userService = new UserService();
      const user = await userService.loginUserWithEmailAndPassword(email, password);
      const tokens = await generateAuthTokens(user);
      return { user, tokens };
    } catch (err) {
      logger.error(`err: ${err}`);
      throw new ApiError(err.statusCode || 401, err.message);
    }
  }

  public async getUsers(): Promise<User[]> {
    try {
      const users = await sqlToDB(`SELECT * FROM public.users`, []);
      let { rows = [] } = users;
      rows = rows.map((row: User) => {
        delete row.password;
        return row;
      });
      return rows;
    } catch (err) {
      logger.error(`err: ${err}`);
      throw new ApiError(err.statusCode || 500, err.message);
    }
  }
}
