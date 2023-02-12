import { asyncMw } from 'express-asyncmw';
import httpStatus from 'http-status';
import _ from 'lodash';
import { z } from 'zod';
import { cleanUpImageDir, createImage, loadImageToCv } from '../utils/common';
import { resolvePromise } from '../utils/resolver';
import Tensorflow from '../utils/Tensorflow';
import { gradeSchema } from '../utils/validator';

export const validatePayloadMw = asyncMw(async (req, res, next) => {
  try {
    gradeSchema.parse(_.values(req.body));

    return next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        code: 400,
        status: httpStatus['400_NAME'],
        message: _.map(err.errors, (err) => err.message),
      });
    }
  }
});

export const uploadImageMw = asyncMw(async (req, res, next) => {
  await cleanUpImageDir();

  await Promise.all(_.map(req.body, (value, key) => resolvePromise(createImage(value, key))));

  return next();
});

export const loadImageMw = asyncMw(async (req, res, next) => {
  req.images = await Promise.all(_.map(req.body, (_, key) => loadImageToCv(key)));

  return next();
});

export const predictImageMw = asyncMw(async (req, res, next) => {
  req.grades = await Promise.all(
    _.map(req.images, ([image, err]: Awaited<ReturnType<typeof loadImageToCv>>) => {
      if (err || !image)
        return {
          score: null,
          times: 0,
        };

      return Tensorflow.instance.predict(image);
    })
  );

  return next();
});

export const returnResultMw = asyncMw(async (req, res, next) => {
  if (!req.grades)
    return res.status(400).json({
      code: 400,
      status: httpStatus['400_NAME'],
      message: 'Failed to grades all the image',
    });

  return res.status(200).json({
    code: 200,
    status: httpStatus['200_NAME'],
    data: _.get(req, 'grades', []),
  });
});
