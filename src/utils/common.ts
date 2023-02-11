import fs from 'fs-extra';
import jimp from 'jimp';
import path from 'path';
import { IMAGE_DIR_PATH } from './constant';
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
  const buffer = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  const image = await openImage(buffer);
  const extension = image.getExtension();
  const isPng = extension === 'png';
  const filePath = path.resolve(IMAGE_DIR_PATH, `${fileName}.jpg`);
  image.resize(256, 256);

  if (isPng) image.quality(60);

  return image.writeAsync(filePath);
};

export const removeImageDir = () =>
  fs.rm(IMAGE_DIR_PATH, {
    recursive: true,
    force: true,
  });

export const createImageDir = () => fs.mkdirp(IMAGE_DIR_PATH);

export const isImageDirExist = () => fs.exists(IMAGE_DIR_PATH);

export const cleanUpImageDir = async () => {
  if (!(await isImageDirExist())) return createImageDir();

  await removeImageDir();
  return createImageDir();
};

export const readImageDir = () => fs.readdir(IMAGE_DIR_PATH);

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
