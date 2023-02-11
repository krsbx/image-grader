import { Express } from 'express';
import _ from 'lodash';
import { cleanUpImageDir, createImage, loadImageToCv } from '../src/utils/common';
import { GRADES } from '../src/utils/constant';
import Tensorflow from '../src/utils/Tensorflow';
import { isImageExist, loadImageToBase64 } from './utils/common';
import { createMockApi, createPostRequest } from './utils/mock';

describe('Image Grader', () => {
  let app: Express;

  beforeAll(async () => {
    app = await createMockApi();
  });

  it('Can save payloads to the disks', async () => {
    await createPostRequest(app).send({
      A: await loadImageToBase64('images/img-A-45.jpg'),
    });

    expect(await isImageExist('A.jpg')).toBe(true);
  });

  it("Can't save a random payloads to the disks", async () => {
    await createPostRequest(app).send({
      A: 'the/_random/_text',
    });

    expect(await isImageExist('A.jpg')).toBe(false);
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

    expect(_.intersection(Object.values(GRADES), [body.data[0].score]).length).toBe(1);
  });

  it('Predict can predict the grade of the images', async () => {
    const fileName = 'test-image';
    await cleanUpImageDir();
    await createImage(await loadImageToBase64('images/img-AB-231.jpg'), fileName);
    const [image, error] = await loadImageToCv(fileName);

    if (error || !image) return;

    const grade = await Tensorflow.instance.predict(image);

    expect(grade).toBeTruthy();
  });
});
