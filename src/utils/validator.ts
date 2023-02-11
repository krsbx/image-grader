import z from 'zod';

export const gradeSchema = z.array(
  z.string({
    description: 'Request body should only be a string',
  })
);

export type GradeSchema = z.infer<typeof gradeSchema>;
