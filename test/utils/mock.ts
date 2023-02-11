import express, { Express } from 'express';
import supertest from 'supertest';
import OpenCv from '../../src/utils/OpenCv';
import root from '../../src/utils/root';
import Tensorflow from '../../src/utils/Tensorflow';

export const createMockApi = async () => {
  await OpenCv.init();
  await Tensorflow.init();

  const app = express();

  root(app);

  return app;
};

export const createPostRequest = (app: Express, endpoint = '/grades') => {
  return supertest(app)
    .post(endpoint)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
};
