import type cv from 'mirada';
import canvas from 'canvas';
import { JSDOM } from 'jsdom';

class OpenCv {
  private static _cv: typeof cv;
  private static _instance: OpenCv;

  constructor() {}

  private static setupDom() {
    const dom = new JSDOM();
    globalThis.document = dom.window.document;

    // @ts-ignore
    globalThis.Image = canvas.Image;
    // @ts-ignore
    globalThis.HTMLCanvasElement = canvas.Canvas;
    // @ts-ignore
    globalThis.ImageData = canvas.ImageData;
    // @ts-ignore
    globalThis.HTMLImageElement = canvas.Image;
  }

  private static setupCV() {
    return new Promise((resolve) => {
      // @ts-ignore
      globalThis.Module = {
        onRuntimeInitialized: resolve,
      };
      var cv = require('./bin/opencv.js');
      globalThis.cv = cv;

      OpenCv._cv = cv;
    });
  }

  public static init() {
    if (OpenCv._cv) return;
    OpenCv._instance = new OpenCv();

    this.setupDom();
    return this.setupCV();
  }

  public static get instance() {
    return OpenCv._instance;
  }

  public static get cv() {
    return OpenCv._cv;
  }

  public static set cv(newCv: typeof cv) {
    OpenCv._cv = newCv;
  }

  public async loadImage(filePath: string) {
    const image = await canvas.loadImage(filePath);
    const src = OpenCv.cv.imread(image as unknown as HTMLImageElement);

    return src;
  }

  public async convertColor(src: cv.Mat) {
    const dest = new OpenCv.cv.Mat();
    OpenCv.cv.cvtColor(src, dest, OpenCv.cv.COLOR_BGR2RGB);

    return dest;
  }
}

export default OpenCv;
