import { Router } from 'express';
import { ExamsController } from './exams.controller';
import { jwtGuard } from '../../common/guards/jwt.guard';

const router = Router();
const controller = new ExamsController();

router.use(jwtGuard);

router.post('/', (req, res) => controller.scheduleExam(req, res));
router.get('/', (req, res) => controller.listExams(req, res));
router.post('/:examId/result', (req, res) => controller.uploadResult(req, res));
router.get('/patient/:patientId', (req, res) => controller.getPatientExams(req, res));

export default router;
