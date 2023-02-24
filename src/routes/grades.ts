import { Router } from 'express';
import * as gradesMw from '../middleware/grades';

const router = Router();

// POST /grades
router.post(
  '/',
  gradesMw.validatePayloadMw,
  gradesMw.saveImagesMw,
  gradesMw.loadImagesMw,
  gradesMw.predictImagesMw,
  gradesMw.returnResultsMw
);

export default router;
