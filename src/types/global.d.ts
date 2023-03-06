/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { Canvas, Image } from 'canvas';
import { JSDOM } from 'jsdom';

declare global {
  var document: JSDOM['window']['Document'];
  var Image: Image;
  var HTMLCanvasElement: Canvas;
  var ImageData: ImageData;
  var HTMLImageElement: Image;

  var cv: import('mirada');

  var Module: {
    onRuntimeInitialized: (...args: unknown[]) => void;
  };

  namespace NodeJS {
    interface ProcessEnv {
      MODE?: string;
      PORT?: string;
      DEBUG?: boolean;
    }
  }
}

export {};
