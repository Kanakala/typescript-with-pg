import { Book } from '../models/book';
import logger from '../utils/logger';
import { sqlToDB } from '../utils/dbUtil';

export class BookService {
  public async getBook(bookId: string): Promise<Book> {
    try {
      const bookResult = await sqlToDB(`SELECT * FROM public.book WHERE id='${bookId}'`, []);
      const [book] = bookResult.rows;
      if (!book) {
        const err = 'Book Not Found';
        logger.error(`err: ${err}`);
        throw Error(err);
      }
      return book;
    } catch (err) {
      logger.error(`err: ${err}`);
      throw err;
    }
  }
}
