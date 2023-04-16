import cluster from 'cluster';
import { NextFunction, Request, Response } from 'express';

export const setupClusterKiller = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalSend = res.send.bind(res);

  res.send = (body: unknown): any => {
    originalSend(body);

    cluster.worker?.kill();
  };

  next();
};
