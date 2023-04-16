/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as tf from '@tensorflow/tfjs-node';
import path from 'path';
import { GRADES, MODEL_PATH } from './constant';

class Tensorflow {
  // eslint-disable-next-line no-use-before-define
  private static _instance: Tensorflow;
  private static _model: tf.LayersModel;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static async init() {
    if (Tensorflow._instance) return;
    Tensorflow._instance = new Tensorflow();

    const model = await tf.loadLayersModel(
      `file://${path.resolve(MODEL_PATH, 'model.json')}`
    );
    Tensorflow._model = model;
  }

  public static destroy() {
    // @ts-ignore
    delete Tensorflow._instance;
    // @ts-ignore
    delete Tensorflow._model;
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
    const start = performance.now();

    const tensor = tf.tensor4d([imageData]);

    const result = Tensorflow.model.predict(tensor);
    const resultData: Float32Array | Int32Array | Uint8Array = Array.isArray(
      result
    )
      ? await result[0].data()
      : await result.data();

    const end = performance.now();

    return {
      score: Object.values(GRADES)[resultData.indexOf(Math.max(...resultData))],
      times: end - start,
    };
  }
}

export default Tensorflow;
