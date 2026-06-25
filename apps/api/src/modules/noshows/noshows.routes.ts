import { Router } from 'express';
import { NoShowsController } from './noshows.controller';
import { jwtGuard } from '../../common/guards/jwt.guard';

const router = Router();
const controller = new NoShowsController();

router.use(jwtGuard);

router.post('/:appointmentId/record', (req, res) => controller.recordNoShow(req, res));
router.get('/patient/:patientId/stats', (req, res) => controller.getStats(req, res));
router.post('/patient/:patientId/unblock', (req, res) => controller.unblockPatient(req, res));

export default router;
