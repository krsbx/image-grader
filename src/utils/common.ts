import fs from 'fs-extra';
import jimp from 'jimp';
import _ from 'lodash';
import path from 'path';
import { BASE64_RE, IMAGE_DIR_PATH } from './constant';
import OpenCv from './OpenCv';

export const openImage = (buffer: Buffer) =>
  new Promise<ReturnType<typeof jimp['read']>>((resolve, reject) => {
    jimp.read(buffer, (err, res) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(res as unknown as ReturnType<typeof jimp['read']>);
    });
  });

export const createImage = async (imageData: string, fileName: string) => {
  const buffer = Buffer.from(imageData.replace(BASE64_RE, ''), 'base64');

  const image = await openImage(buffer);
  const extension = image.getExtension();
  const isPng = extension === 'png';
  const filePath = path.resolve(IMAGE_DIR_PATH, `${fileName}.jpg`);
  image.resize(256, 256);

  if (isPng) image.quality(60);

  return image.writeAsync(filePath);
};

export const concatPath = (...filePaths: (string | undefined | null)[]) => {
  const paths = _.compact([...filePaths]);

  return path.join(...paths);
};

export const removeImageDir = (filePath?: string) =>
  fs.rm(concatPath(IMAGE_DIR_PATH, filePath), {
    recursive: true,
    force: true,
  });

export const createImageDir = (filePath?: string) =>
  fs.mkdirp(concatPath(IMAGE_DIR_PATH, filePath));

export const isImageDirExist = (filePath?: string) =>
  fs.exists(concatPath(IMAGE_DIR_PATH, filePath));

export const cleanUpImageDir = async (filePath?: string) => {
  if (!(await isImageDirExist(filePath))) return createImageDir(filePath);

  await removeImageDir(filePath);
  return createImageDir(filePath);
};

export const readImageDir = (filePath?: string) => fs.readdir(concatPath(IMAGE_DIR_PATH, filePath));

export const loadImageToCv = async (fileName: string) => {
  try {
    const image = await OpenCv.instance.loadImage(path.resolve(IMAGE_DIR_PATH, `${fileName}.jpg`));
    const converted = await OpenCv.instance.convertColor(image);
    const formatted = await OpenCv.instance.convertToNumpyFormat(converted);

    return [formatted, null] as const;
  } catch (err) {
    return [null, err] as const;
  }
};
