import { config as dotenvConfig } from 'dotenv';
import { expand as expandDotenv } from 'dotenv-expand';
import { Express } from 'express';
import _ from 'lodash';
import {
  cleanUpImageDir,
  createImage,
  loadImageToCv,
  readImageDir,
} from '../src/utils/common';
import { GRADES } from '../src/utils/constant';
import Tensorflow from '../src/utils/Tensorflow';
import { isImageExist, loadImageToBase64 } from './utils/common';
import { startLoadTest } from './utils/loadtest';
import {
  createBulkRequest,
  createMockApi,
  createPostRequest,
} from './utils/mock';

expandDotenv(dotenvConfig());

describe('Image Grader', () => {
  let app: Express;

  beforeAll(async () => {
    app = await createMockApi();
  });

  it('Can save payloads to the disks', async () => {
    await cleanUpImageDir();

    await createPostRequest(app).send({
      A: await loadImageToBase64('images/img-A-45.jpg'),
    });

    const dirInfos = await readImageDir();

    const exists = await Promise.all(
      _.map(dirInfos, (dirInfo) => isImageExist(`${dirInfo}/0.jpg`))
    );

    expect(_.includes(exists, true)).toBe(true);
  });

  it("Can't save a random payloads to the disks", async () => {
    await cleanUpImageDir();

    await createPostRequest(app).send({
      A: 'the/_random/_text',
    });

    const dirInfos = await readImageDir();

    const exists = await Promise.all(
      _.map(dirInfos, (dirInfo) => isImageExist(`${dirInfo}/0.jpg`))
    );

    expect(_.includes(exists, true)).toBe(false);
  });

  it('Can trigger the predict functions', async () => {
    const { body } = await createPostRequest(app).send({
      B: await loadImageToBase64('images/img-B-4.jpg'),
    });

    expect(body.data[0]).toBeDefined();
  });

  it('Can return the grades from the inputs ', async () => {
    const { body } = await createPostRequest(app).send({
      BC: await loadImageToBase64('images/img-BC-101.jpg'),
    });

    expect(
      _.intersection(Object.values(GRADES), [body.data[0].score]).length
    ).toBe(1);
  });

  it('Predict can predict the grade of the images', async () => {
    const fileName = 'test-image';
    await cleanUpImageDir();
    await createImage(
      await loadImageToBase64('images/img-AB-231.jpg'),
      fileName
    );
    const [image, error] = await loadImageToCv(fileName);

    if (error || !image) return;

    const grade = await Tensorflow.instance.predict(image);

    expect(grade).toBeTruthy();
  });

  it('Cant handle multiple predictions request', async () => {
    const responses = _(await createBulkRequest(app))
      .map(({ body: { data } }) => data[0])
      .value();

    expect(
      responses
        .map(({ score }) => score)
        .every((score) => Object.values(GRADES).includes(score))
    ).toBe(true);
  });

  it('Can handle lot of requests', async () => {
    const port = +(process.env?.PORT ?? 3001);
    const server = app.listen(port, () =>
      console.log(`Server are running on port ${port}`)
    );

    const result = await startLoadTest();
    server.close();

    expect(result.totalRequests).toBe(100);
  });
});
