import { Application, Request, Response } from 'express';
import { BookController } from '../controllers/bookController';
import logger from '../utils/logger';
import { auth } from '../middlewares/auth';
import { catchAsync } from '../utils/catchAsync';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const routes = (app: Application) => {
  app.get(
    '/book',
    auth(['ADMIN', 'SUBSCRIBER']),
    catchAsync(async (req: Request, res: Response) => {
      const bookController = new BookController();
      const data = await bookController.getBooks();
      logger.info(`data in route: ${JSON.stringify(data)}`);
      res.json(data);
    }),
  );

  app.post(
    '/book',
    auth(['ADMIN']),
    catchAsync(async (req: Request, res: Response) => {
      const bookController = new BookController();
      const data = await bookController.createBook(req.body);
      logger.info(`data in route: ${JSON.stringify(data)}`);
      res.json(data);
    }),
  );

  app.put(
    '/book/:bookId',
    auth(['ADMIN']),
    catchAsync(async (req: Request, res: Response) => {
      const bookController = new BookController();
      const data = await bookController.updateBook(req.body, req.params.bookId);
      logger.info(`data in route: ${JSON.stringify(data)}`);
      res.json(data);
    }),
  );

  app.delete(
    '/book/:bookId',
    auth(['ADMIN']),
    catchAsync(async (req: Request, res: Response) => {
      const bookController = new BookController();
      const data = await bookController.deleteBook(req.params.bookId);
      logger.info(`data in route: ${JSON.stringify(data)}`);
      res.json(data);
    }),
  );
};
