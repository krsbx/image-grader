import fs from 'fs-extra';
import path from 'path';
import { concatPath } from '../../src/utils/common';
import { BASE64_RE, IMAGE_DIR_PATH } from '../../src/utils/constant';

export const loadImageToBase64 = async (filePath: string) =>
  (await fs.readFile(path.resolve(__dirname, '..', filePath), 'base64')).replace(BASE64_RE, '');

export const isImageExist = (fileName: string) => fs.exists(concatPath(IMAGE_DIR_PATH, fileName));
