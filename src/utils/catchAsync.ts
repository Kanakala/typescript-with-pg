import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const catchAsync = (fn: any) => (req: Request, res: Response) => {
  Promise.resolve(fn(req, res)).catch((err) => res.status(err.statusCode).send(err.message));
};
