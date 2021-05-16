import { Application, Request, Response } from 'express';
import { UserFavoriteController } from '../controllers/userFavoriteController';
import logger from '../utils/logger';
import { auth } from '../middlewares/auth';
import { catchAsync } from '../utils/catchAsync';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const routes = (app: Application) => {
  app.get(
    '/user-favorite/:userId',
    auth(['ADMIN', 'SUBSCRIBER']),
    catchAsync(async (req: Request, res: Response) => {
      const favController = new UserFavoriteController();
      const data = await favController.getUserFavorites(req.params.userId);
      logger.info(`data in route: ${JSON.stringify(data)}`);
      res.json(data);
    }),
  );

  app.post(
    '/user-favorite',
    auth(['ADMIN', 'SUBSCRIBER']),
    catchAsync(async (req: Request, res: Response) => {
      const favController = new UserFavoriteController();
      const data = await favController.createUserFavorite(req.body);
      logger.info(`data in route: ${JSON.stringify(data)}`);
      res.json(data);
    }),
  );

  app.delete(
    '/book/:userFavoriteId',
    auth(['ADMIN']),
    catchAsync(async (req: Request, res: Response) => {
      const favController = new UserFavoriteController();
      const data = await favController.deleteUserFavorite(req.params.userFavoriteId);
      logger.info(`data in route: ${JSON.stringify(data)}`);
      res.json(data);
    }),
  );
};
