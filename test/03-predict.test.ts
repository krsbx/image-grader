import { setupEnv } from '../src/utils/setup';
import { loadImageToBase64 } from './utils/common';
import {
  createMockData,
  destroyModules,
  initModules,
  mockPredictMw,
} from './utils/mock';

setupEnv();

describe('Image Grader : Predict Function', () => {
  it('Can return the predict results when Tensorflow and OpenCV is initialized', async () => {
    await initModules();

    const { req, res } = createMockData({
      body: {
        A: await loadImageToBase64('images/img-B-4.jpg'),
      },
    });

    await mockPredictMw(req, res);

    expect(req.grades[0].score).toBeTruthy();
  });

  it("Can't return the predict results when Tensorflow and OpenCV is not initialized", async () => {
    destroyModules();

    const { req, res } = createMockData({
      body: {
        A: await loadImageToBase64('images/img-A-45.jpg'),
      },
    });

    await mockPredictMw(req, res);

    expect(req.images[0][1]).toBeInstanceOf(Error);
  });
});
