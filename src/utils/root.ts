import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import gradesRoute from '../routes/grades';
import Server from './Server';

export default (app: Express) => {
  app.use(helmet());
  app.use(express.json({ limit: '1gb' }));
  app.use(express.urlencoded({ limit: '1gb', extended: true }));
  app.use(express.static('public'));
  app.use(cors());
  app.use(Server.autoKillCluster());

  app.use('/grades', gradesRoute);
};
