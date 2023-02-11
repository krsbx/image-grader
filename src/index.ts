import { config as dotenvConfig } from 'dotenv';
import { expand as expandDotenv } from 'dotenv-expand';
import express from 'express';
import OpenCv from './utils/OpenCv';
import root from './utils/root';
import Tensorflow from './utils/Tensorflow';

expandDotenv(dotenvConfig());

const PORT = process.env.PORT || 3001;

const setupServer = async () => {
  await OpenCv.init();
  await Tensorflow.init();

  const app = express();

  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });

  root(app);
};

setupServer();
