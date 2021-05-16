import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import express, { Application } from 'express';
import * as routes from './routes';
import { port } from './config/config';
import logger from './utils/logger';
import { jwtStrategy } from './config/passport';

const app: Application = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
// app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Configure routes
routes.register(app);

app.listen(port, (err) => {
  if (err) {
    return logger.error(err);
  }
  const welcomeMessage = `server is listening on ${port}`;
  logger.info(welcomeMessage);
  return welcomeMessage;
});
