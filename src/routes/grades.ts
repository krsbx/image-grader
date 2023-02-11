import { Router } from 'express';
import * as gradesMw from '../middleware/grades';

const router = Router();

// POST /grades
router.post(
  '/',
  gradesMw.validateMw,
  gradesMw.uploadMw,
  gradesMw.loadMw,
  gradesMw.predictMw,
  gradesMw.returnMw
);

export default router;
