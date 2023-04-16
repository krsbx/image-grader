import _ from 'lodash';
import * as middleware from '../src/middleware/grades';
import { GRADES } from '../src/utils/constant';
import { setupEnv } from '../src/utils/setup';
import { extractMiddleware, loadImageToBase64 } from './utils/common';
import {
  createMockData,
  initModules,
  mockNextFn,
  mockPredictMw,
} from './utils/mock';

setupEnv();

describe('Image Grader : Prediction Result', () => {
  it('Can return the grades from the inputs ', async () => {
    await initModules();
    const mw = extractMiddleware(middleware.returnResultsMw);
    const { req, res } = createMockData({
      body: {
        BC: await loadImageToBase64('images/img-BC-101.jpg'),
      },
    });

    await mockPredictMw(req, res);
    mw(req, res, mockNextFn);

    const { data } = res._getJSONData();

    expect(_.intersection(Object.values(GRADES), [data[0].score]).length).toBe(
      1
    );
  });
});
