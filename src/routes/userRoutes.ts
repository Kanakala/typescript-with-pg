import { Application, Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import logger from '../utils/logger';
import { auth } from '../middlewares/auth';
import { catchAsync } from '../utils/catchAsync';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const routes = (app: Application) => {
  // home page
  app.get('/', (req: Request, res: Response) => {
    res.send('Hello Server is Working!!!!');
  });

  app.get(
    '/user',
    auth(['ADMIN']),
    catchAsync(async (req: Request, res: Response) => {
      const userController = new UserController();
      const data = await userController.getUsers();
      logger.info(`data in route: ${JSON.stringify(data)}`);
      res.json(data);
    }),
  );

  app.post(
    '/user',
    catchAsync(async (req: Request, res: Response) => {
      const userController = new UserController();
      const data = await userController.createUser(req.body);
      logger.info(`data in route: ${JSON.stringify(data)}`);
      res.json(data);
    }),
  );

  app.put(
    '/user/:userId',
    auth(['ADMIN']),
    catchAsync(async (req: Request, res: Response) => {
      const userController = new UserController();
      const data = await userController.updateUser(req.body, req.params.userId);
      logger.info(`data in route: ${JSON.stringify(data)}`);
      res.json(data);
    }),
  );

  app.post(
    '/login',
    catchAsync(async (req: Request, res: Response) => {
      const userController = new UserController();
      const data = await userController.login(req.body.email, req.body.password);
      logger.info(`data in route: ${JSON.stringify(data)}`);
      res.json(data);
    }),
  );
};
