import express, { Express } from 'express';
import _ from 'lodash';
import httpMocks from 'node-mocks-http';
import supertest from 'supertest';
import * as middleware from '../../src/middleware/grades';
import OpenCv from '../../src/utils/OpenCv';
import root from '../../src/utils/root';
import Tensorflow from '../../src/utils/Tensorflow';
import {
  extractMiddleware,
  loadImageToBase64,
  resolveMiddleware,
} from './common';
import { IMAGES } from './constant';

export const initModules = () =>
  Promise.all([OpenCv.init(), Tensorflow.init()]);

export const destroyModules = () => {
  OpenCv.destroy();
  Tensorflow.destroy();
};

export const createMockApi = async () => {
  await initModules();

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

  // eslint-disable-next-line no-restricted-syntax
  for (const [, image] of Object.entries(images))
    request.push(
      // eslint-disable-next-line no-await-in-loop
      await createPostRequest(app).send({
        // eslint-disable-next-line no-await-in-loop
        img: await loadImageToBase64(`images/${image}`),
      })
    );

  return request;
};

export const createMockData = ({
  url = '/grades',
  method = 'POST',
  body = {},
  query = {},
}: {
  method?: httpMocks.RequestMethod;
  url?: string;
  body?: httpMocks.Body;
  query?: httpMocks.Query;
}) => {
  const { req, res } = httpMocks.createMocks({
    url,
    method,
    query: {
      times: new Date().getTime(),
      ...(_.isObject(query) ? query : {}),
    },
    body,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
  });

  return { req, res };
};

export const mockPredictMw = async <T, U>(req: T, res: U) => {
  const mws = [
    extractMiddleware(middleware.saveImagesMw),
    extractMiddleware(middleware.loadImagesMw),
    extractMiddleware(middleware.predictImagesMw),
  ];

  await resolveMiddleware({ req, res, mw: mws[0] });
  await resolveMiddleware({ req, res, mw: mws[1] });
  await resolveMiddleware({ req, res, mw: mws[2] });
};

export const mockNextFn = () => {
  return null;
};
