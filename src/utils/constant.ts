import path from 'path';

export const ROOT_PATH = path.join(__dirname, process.env.DEVELOPMENT ? '../../' : '../../../');

export const BIN_PATH = path.join(ROOT_PATH, 'bin');
export const MODEL_PATH = path.join(ROOT_PATH, 'bin/model');
export const IMAGE_DIR_PATH = path.resolve(ROOT_PATH, 'public/tmp');

export const BASE64_RE = /^data:image\/\w+;base64,/;

export const GRADES = {
  A: 'A',
  AB: 'AB',
  B: 'B',
  BC: 'BC',
  C: 'C',
  D: 'D',
  E: 'E',
} as const;
