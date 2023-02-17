import express, { Express } from 'express';
import supertest from 'supertest';
import OpenCv from '../../src/utils/OpenCv';
import root from '../../src/utils/root';
import Tensorflow from '../../src/utils/Tensorflow';
import { loadImageToBase64 } from './common';
import { IMAGES } from './constant';

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

export const createBulkRequest = async (app: Express) => {
  const images = [
    IMAGES.A[0],
    IMAGES.A[1],
    IMAGES.B[0],
    IMAGES.B[1],
    IMAGES.BC[0],
    IMAGES.BC[1],
    IMAGES.E[0],
    IMAGES.E[1],
  ];

  const request: supertest.Response[] = [];

  for (const [, image] of Object.entries(images))
    request.push(
      await createPostRequest(app).send({
        img: await loadImageToBase64(`images/${image}`),
      })
    );

  return request;
};
