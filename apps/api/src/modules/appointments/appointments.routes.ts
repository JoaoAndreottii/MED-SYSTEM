import { Router } from 'express';
import { AppointmentController } from './appointments.controller';
import { jwtGuard } from '../../common/guards/jwt.guard';

const router = Router();
const controller = new AppointmentController();

router.use(jwtGuard);

router.post('/', (req, res) => controller.create(req, res));
router.get('/', (req, res) => controller.list(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.patch('/:id/status', (req, res) => controller.updateStatus(req, res));
router.post('/:id/cancel', (req, res) => controller.cancel(req, res));

export default router;
