import asyncMw from 'express-asyncmw';
import httpStatus from 'http-status';
import _ from 'lodash';
import { z } from 'zod';
import type * as ImageGrader from '../types/ImageGrader';
import {
  createImage,
  isImageDirExist,
  loadImageToCv,
  removeImageDir,
} from '../utils/common';
import { resolvePromise } from '../utils/resolver';
import { RequestSchema, requestSchema } from '../utils/schema';
import Tensorflow from '../utils/Tensorflow';

export const validatePayloadMw = asyncMw<ImageGrader.ValidatePayloadMw>(
  async (req, res, next) => {
    try {
      req.body = requestSchema.parse(_.values(req.body));
      req.query.times = new Date().getTime();

      return next();
    } catch (err) {
      if (err instanceof z.ZodError<RequestSchema>) {
        return res.status(400).json({
          code: 400,
          status: httpStatus['400_NAME'],
          message: _.map(err.errors, (err) => err.message),
        });
      }
    }
  }
);

export const saveImagesMw = asyncMw<ImageGrader.SaveImagesMw>(
  async (req, res, next) => {
    await Promise.all(
      _.map(req.body, (value, key) =>
        resolvePromise(createImage(value, `${req.query.times}/${key}`))
      )
    );

    return next();
  }
);

export const loadImagesMw = asyncMw<ImageGrader.LoadImagesMw>(
  async (req, res, next) => {
    req.images = await Promise.all(
      _.map(req.body, (_, key) => loadImageToCv(`${req.query.times}/${key}`))
    );

    return next();
  }
);

export const predictImagesMw = asyncMw<ImageGrader.PredictImagesMw>(
  async (req, res, next) => {
    req.grades = await Promise.all(
      _.map(req.images, ([image, err]) => {
        if (err || !image)
          return {
            score: null,
            times: 0,
          };

        return Tensorflow.instance.predict(image);
      })
    );

    return next();
  }
);

export const returnResultsMw = asyncMw<ImageGrader.ReturnResultsMw>(
  async (req, res, next) => {
    if (await isImageDirExist(req.query.times + ''))
      await removeImageDir(req.query.times + '');

    if (!req.grades)
      return res.status(400).json({
        code: 400,
        status: httpStatus['400_NAME'],
        message: 'Failed to grades all the image',
      });

    return res.status(200).json({
      code: 200,
      status: httpStatus['200_NAME'],
      data: req.grades || [],
    });
  }
);
