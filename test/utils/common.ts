import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { concatPath } from '../../src/utils/common';
import { BASE64_RE, IMAGE_DIR_PATH } from '../../src/utils/constant';

export const loadImageToBase64 = async (filePath: string) =>
  (
    await fs.readFile(path.resolve(__dirname, '..', filePath), 'base64')
  ).replace(BASE64_RE, '');

export const isImageExist = (fileName: string) =>
  fs.exists(concatPath(IMAGE_DIR_PATH, fileName));

export const extractMiddleware = <
  T,
  U extends T extends Array<unknown> ? T[0] : T
>(
  mw: T
): U => (Array.isArray(mw) ? mw[0] : mw);

export const resolveMiddleware = <T, U>({
  req,
  res,
  mw,
}: {
  mw: express.RequestHandler;
  req: T;
  res: U;
}) =>
  new Promise<void>((resolve, reject) => {
    mw(req as never, res as never, (err: unknown) => {
      if (err instanceof Error) {
        reject(err);
      }

      resolve();
    });
  });
