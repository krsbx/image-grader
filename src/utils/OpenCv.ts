import canvas from 'canvas';
import { JSDOM } from 'jsdom';
import type cv from 'mirada';
import path from 'path';
import { BIN_PATH } from './constant';

class OpenCv {
  private static _cv: typeof cv;
  private static _instance: OpenCv;

  constructor() {}

  private static setupDom() {
    const dom = new JSDOM();
    globalThis.document = dom.window.document;

    globalThis.Image = canvas.Image as unknown as typeof globalThis.Image;
    globalThis.HTMLCanvasElement = canvas.Canvas as unknown as typeof globalThis.HTMLCanvasElement;
    globalThis.ImageData = canvas.ImageData as unknown as typeof globalThis.ImageData;
    globalThis.HTMLImageElement = canvas.Image as unknown as typeof globalThis.HTMLImageElement;
  }

  private static setupCV() {
    return new Promise((resolve) => {
      (
        globalThis as unknown as {
          Module: Record<string, Function>;
        }
      ).Module = {
        onRuntimeInitialized: resolve,
      };
      var cv = require(path.resolve(BIN_PATH, 'opencv.js'));
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

  public async convertToNumpyFormat(src: cv.Mat) {
    const informations = {
      width: src.cols,
      height: src.rows,
      data: src.data as Uint8Array,
      channels: src.channels(),
      get size() {
        return this.width * this.height * this.channels;
      },
      get limit() {
        return Math.max(this.width, this.height) * this.channels;
      },
      totalSkip: 0,
    };

    const dest: number[][][] = [];

    for (let i = 0; i < informations.size; i += informations.limit) {
      const start = informations.totalSkip > 0 ? informations.totalSkip : 0;
      const end =
        informations.totalSkip > 0
          ? informations.totalSkip + informations.limit
          : informations.limit;

      const newArr = informations.data.slice(start, end);
      const arr: number[][] = [];

      for (let j = 0; j < newArr.length; j += informations.channels) {
        arr.push([newArr[j], newArr[j + 1], newArr[j + 2]]);
      }

      dest.push(arr);
      informations.totalSkip += informations.limit;
    }

    return dest;
  }
}

export default OpenCv;
