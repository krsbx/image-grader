import { z } from 'zod';

export const requestSchema = z.array(
  z.string({
    description: 'Request body should only be a string',
  })
);

export type RequestSchema = z.infer<typeof requestSchema>;
