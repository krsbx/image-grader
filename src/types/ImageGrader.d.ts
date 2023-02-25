import { loadImageToCv } from '../utils/common';
import Tensorflow from '../utils/Tensorflow';

export type ValidatePayloadMw = {
  reqBody: Record<string, string> | string[];
  reqQuery: { times: number };
};

export type SaveImagesMw = {
  reqBody: string[];
  reqQuery: { times: number };
};

export type LoadImagesMw = {
  reqBody: string[];
  reqQuery: { times: number };
  extends: { images: Awaited<ReturnType<typeof loadImageToCv>>[] };
};

export type PredictImagesMw = {
  extends: {
    images: LoadImagesMw['extends']['images'];
    grades: (
      | Awaited<ReturnType<typeof Tensorflow.instance.predict>>
      | {
          score: null;
          times: number;
        }
    )[];
  };
};

export type ReturnResultsMw = {
  extends: {
    grades: PredictImagesMw['extends']['grades'];
  };
  resBody:
    | {
        code: number;
        status: string;
        message: string;
      }
    | {
        code: number;
        status: string;
        data: PredictImagesMw['extends']['grades'];
      };
};

export as namespace ImageGrader;
