import { Application } from 'express';
import * as userRoutes from './userRoutes';
import * as bookRoutes from './bookRoutes';
import * as userFavoriteRoutes from './userFavoriteRoutes';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const register = (app: Application) => {
  // UserRoutes
  userRoutes.routes(app);

  // BookRoutes
  bookRoutes.routes(app);

  // UserFavRoutes
  userFavoriteRoutes.routes(app);
};
