import cluster from 'cluster';
import { config as dotenvConfig } from 'dotenv';
import { expand as expandDotenv } from 'dotenv-expand';
import express, { Express, NextFunction, Request, Response } from 'express';
import os from 'os';
import { setupClusterKiller } from './config';
import { SERVER_MODE } from './constant';
import root from './root';

expandDotenv(dotenvConfig());

class Server {
  private static N_CPU: number = os.cpus().length;
  private static _instance: Server;
  private static port: number = +(process.env?.PORT ?? 3001);
  private static app: Express = express();

  constructor() {}

  public static init() {
    root(Server.app);

    if (Server.nCpu === 1) {
      Server.app.listen(Server.port, () =>
        console.log(`Server are running on port ${Server.port}`)
      );
      return;
    }

    this.instance.spawnCluster();
  }

  public static get nCpu() {
    switch ((process.env.MODE ?? '').toUpperCase()) {
      case SERVER_MODE.PRODUCTION:
        return Server.N_CPU;

      case SERVER_MODE.DEVELOPMENT:
        return 1;

      default:
        if (!process.env.MODE) break;
        if (Number.isNaN(+process.env.MODE)) break;
        if (+process.env.MODE < 1) break;

        return +process.env.MODE;
    }

    return 1;
  }

  public static get instance() {
    if (!Server._instance) Server._instance = new Server();

    return Server._instance;
  }

  private spawnCluster() {
    if (!cluster.isPrimary) {
      Server.app.listen(Server.port, () =>
        console.log(`PID ${process.pid}: Server started at port ${Server.port}`)
      );

      return;
    }

    for (let i = 0; i < Server.nCpu; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork();
    });
  }

  public static autoKillCluster() {
    return function (req: Request, res: Response, next: NextFunction) {
      if (Server.nCpu === 1) return next();

      return setupClusterKiller(req, res, next);
    };
  }
}

export default Server;
