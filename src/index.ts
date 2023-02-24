import OpenCv from './utils/OpenCv';
import Server from './utils/Server';
import Tensorflow from './utils/Tensorflow';

const setupServer = async () => {
  await OpenCv.init();
  await Tensorflow.init();

  return Server.init();
};

setupServer();
