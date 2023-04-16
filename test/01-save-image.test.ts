import _ from 'lodash';
import * as middleware from '../src/middleware/grades';
import { cleanUpImageDir, readImageDir } from '../src/utils/common';
import { setupEnv } from '../src/utils/setup';
import {
  extractMiddleware,
  isImageExist,
  loadImageToBase64,
  resolveMiddleware,
} from './utils/common';
import { createMockData } from './utils/mock';

setupEnv();

describe('Image Grader : Save Image', () => {
  it('Can save payloads to the disks', async () => {
    await cleanUpImageDir();

    const mw = extractMiddleware(middleware.saveImagesMw);
    const { req, res } = createMockData({
      body: {
        A: await loadImageToBase64('images/img-A-45.jpg'),
      },
    });

    await resolveMiddleware({ req, res, mw });
    const dirInfos = await readImageDir();

    const exists = await Promise.all(
      _.map(dirInfos, (dirInfo) => isImageExist(`${dirInfo}/A.jpg`))
    );

    expect(_.includes(exists, true)).toBe(true);
  });

  it("Can't save a random payloads to the disks", async () => {
    await cleanUpImageDir();

    const mw = extractMiddleware(middleware.saveImagesMw);
    const { req, res } = createMockData({
      body: {
        A: 'the/_random/_text',
      },
    });

    await resolveMiddleware({ req, res, mw });
    const dirInfos = await readImageDir();

    const exists = await Promise.all(
      _.map(dirInfos, (dirInfo) => isImageExist(`${dirInfo}/A.jpg`))
    );

    expect(_.includes(exists, true)).toBe(false);
  });
});
