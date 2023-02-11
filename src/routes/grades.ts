import { Router } from 'express';
import * as gradesMw from '../middleware/grades';

const router = Router();

router.post('/grades', gradesMw.verifyPayloadMw, gradesMw.gradeImagesMw, gradesMw.returnGradesMw);

export default router;
