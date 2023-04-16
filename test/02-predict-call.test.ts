import { setupEnv } from '../src/utils/setup';
import Tensorflow from '../src/utils/Tensorflow';
import { loadImageToBase64 } from './utils/common';
import {
  createMockData,
  destroyModules,
  initModules,
  mockPredictMw,
} from './utils/mock';

setupEnv();

describe('Image Grader : Predict Function Call', () => {
  it('Can run the predict functions when Tensorflow and OpenCV is initialized', async () => {
    await initModules();

    const { req, res } = createMockData({
      body: {
        A: await loadImageToBase64('images/img-B-4.jpg'),
      },
    });

    jest.spyOn(Tensorflow.instance, 'predict');
    await mockPredictMw(req, res);

    expect(Tensorflow.instance.predict).toBeCalledTimes(1);
  });

  it("Can't run the predict functions when Tensorflow and OpenCV is not initialized", async () => {
    destroyModules();

    const { req, res } = createMockData({
      body: {
        A: await loadImageToBase64('images/img-A-45.jpg'),
      },
    });

    await mockPredictMw(req, res);

    expect(Tensorflow.instance).toBeUndefined();
  });
});
