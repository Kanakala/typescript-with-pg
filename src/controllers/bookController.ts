import { validateOrReject } from 'class-validator';
import { Book } from '../models/book';
import logger from '../utils/logger';
import { sqlToDB } from '../utils/dbUtil';
import { BookService } from '../services/bookService';
import { ApiError } from '../utils/apiError';

export class BookController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async createBook(book: Book): Promise<Book> {
    try {
      await validateOrReject(book);
      await sqlToDB(
        `INSERT INTO public.book (${Object.keys(book).join(', ')}) VALUES (${Array.from(
          { length: Object.keys(book).length },
          (_, i) => `$${i + 1}`,
        ).join(', ')})`,
        Object.values(book),
      );
      return book;
    } catch (err) {
      logger.error(`err: ${err}`);
      throw err;
    }
  }

  public async getBooks(): Promise<Book[]> {
    try {
      const bookResults = await sqlToDB(`SELECT * FROM public.book`, []);
      return bookResults.rows;
    } catch (err) {
      logger.error(`err: ${err}`);
      throw err;
    }
  }

  public async updateBook(book: Book, bookId: string): Promise<Book> {
    try {
      if (!bookId) {
        const err = {
          statusCode: 400,
          message: 'Please provide bookId',
        };
        throw err;
      }
      const bookService = new BookService();
      const existingBook = await bookService.getBook(bookId);
      if (!existingBook) {
        const err = {
          statusCode: 400,
          message: 'book Doesnot exists',
        };
        throw err;
      }
      await sqlToDB(
        `UPDATE public.book SET ${Object.entries(book).map(
          ([key, value]) => `"${key.toLowerCase()}"='${value}'`,
        )} WHERE "id"='${bookId}'`,
        [],
      );
      return { ...existingBook, ...book };
    } catch (err) {
      logger.error(`err: ${err}`);
      throw new ApiError(err.statusCode || 400, err.message);
    }
  }

  public async deleteBook(bookId: string): Promise<string> {
    try {
      await sqlToDB(`DELETE FROM public.book where id='${bookId}'`, []);
      return bookId;
    } catch (err) {
      logger.error(`err: ${err}`);
      throw err;
    }
  }
}
