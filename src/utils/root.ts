import cors from 'cors';
import express, { Express } from 'express';
import gradesRoute from '../routes/grades';

export default (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(cors());

  app.use('/grades', gradesRoute);
};
