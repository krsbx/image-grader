import * as tf from '@tensorflow/tfjs-node';
import path from 'path';
import { GRADES, ROOT_PATH } from '../utils/constant';

class Tensorflow {
  private static _instance: Tensorflow;
  private static _model: tf.LayersModel;

  constructor() {}

  public static async init() {
    if (Tensorflow._instance) return;
    Tensorflow._instance = new Tensorflow();

    const model = await tf.loadLayersModel(
      'file://' + path.resolve(ROOT_PATH, 'bin/model/model.json')
    );
    Tensorflow._model = model;
  }

  public static get instance() {
    return Tensorflow._instance;
  }

  public static get model() {
    return Tensorflow._model;
  }

  public static set model(newModel: tf.LayersModel) {
    Tensorflow._model = newModel;
  }

  public async predict(imageData: number[][][]) {
    const tensor = tf.tensor4d([imageData]);

    const result = Tensorflow.model.predict(tensor);

    if (!Array.isArray(result)) {
      const resultData = await result.data();
      return Object.values(GRADES)[resultData.indexOf(Math.max(...resultData))];
    }

    const resultData = await result[0].data();
    return Object.values(GRADES)[resultData.indexOf(Math.max(...resultData))];
  }
}

export default Tensorflow;
