import { Router } from 'express';
import * as gradesMw from '../middleware/grades';

const router = Router();

// POST /grades
router.post(
  '/',
  gradesMw.verifyPayloadMw,
  gradesMw.createImagesMw,
  gradesMw.readImagesMw,
  gradesMw.gradeImagesMw,
  gradesMw.returnGradesMw
);

export default router;
