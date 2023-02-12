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
}

export {};
