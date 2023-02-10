import cv from 'mirada';
import { JSDOM } from 'jsdom';
import { Canvas, Image, ImageData, loadImage } from 'canvas';

declare global {
  var document: JSDOM['window']['Document'];
  var Image: Image;
  var HTMLCanvasElement: Canvas;
  var ImageData: ImageData;
  var HTMLImageElement: Image;

  var cv: typeof cv;
}

export {};
