import { config as dotenvConfig } from 'dotenv';
import { expand as expandDotenv } from 'dotenv-expand';
import { loadTest } from 'loadtest';
import { loadImageToBase64 } from './common';

expandDotenv(dotenvConfig());

type Resolve = {
  totalRequests: number;
  totalErrors: number;
  totalTimeSeconds: number;
  rps: number;
  meanLatencyMs: number;
  maxLatencyMs: number;
  minLatencyMs: number;
  percentiles: Record<string, number>;
  errorCodes: Record<string, number>;
  instanceIndex: number;
};

export const startLoadTest = async (
  imagePath: string = 'images/img-AB-231.jpg'
) => {
  const port = +(process.env?.PORT ?? 3001);

  const base64 = await loadImageToBase64(imagePath);
  const payload = {
    base64,
  };

  return new Promise<Resolve>((resolve, reject) => {
    loadTest(
      {
        url: `http://localhost:${port}/grades`,
        concurrency: 100,
        body: payload,
        maxRequests: 100,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
      (err: unknown, result: Resolve) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      }
    );
  });
};
