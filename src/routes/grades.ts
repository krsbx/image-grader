import { Router } from 'express';
import * as gradesMw from '../middleware/grades';

const router = Router();

// POST /grades
router.post(
  '/',
  gradesMw.validatePayloadMw,
  gradesMw.uploadImageMw,
  gradesMw.loadImageMw,
  gradesMw.predictImageMw,
  gradesMw.returnResultMw
);

export default router;
