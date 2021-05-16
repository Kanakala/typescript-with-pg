import { validateOrReject } from 'class-validator';
import { UserFavorite } from '../models/userFavorite';
import logger from '../utils/logger';
import { sqlToDB } from '../utils/dbUtil';

export class UserFavoriteController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async createUserFavorite(userFavorite: UserFavorite): Promise<UserFavorite> {
    try {
      await validateOrReject(userFavorite);
      await sqlToDB(
        `INSERT INTO public.userFavorite (${Object.keys(userFavorite).join(', ')}) VALUES (${Array.from(
          { length: Object.keys(userFavorite).length },
          (_, i) => `$${i + 1}`,
        ).join(', ')})`,
        Object.values(userFavorite),
      );
      return userFavorite;
    } catch (err) {
      logger.error(`err: ${err}`);
      throw err;
    }
  }

  public async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    try {
      const bookResults = await sqlToDB(
        `SELECT * FROM public.userFavorite "UF" INNER JOIN public.book "book" ON "book"."id"="UF"."bookid" where "UF"."userid"='${userId}'`,
        [],
      );
      return bookResults.rows;
    } catch (err) {
      logger.error(`err: ${err}`);
      throw err;
    }
  }

  public async deleteUserFavorite(userFavoriteId: string): Promise<string> {
    try {
      await sqlToDB(`DELETE FROM public.userFavorite where id='${userFavoriteId}'`, []);
      return userFavoriteId;
    } catch (err) {
      logger.error(`err: ${err}`);
      throw err;
    }
  }
}
