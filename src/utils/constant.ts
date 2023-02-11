import path from 'path';

export const ROOT_PATH = path.join(__dirname, '../../');

export const IMAGE_DIR_PATH = path.resolve(ROOT_PATH, 'public/tmp');

export const GRADES = {
  A: 'A',
  AB: 'AB',
  B: 'B',
  BC: 'BC',
  C: 'C',
  D: 'D',
  E: 'E',
} as const;
