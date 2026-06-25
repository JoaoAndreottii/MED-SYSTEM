import { Router } from 'express';
import { RemindersController } from './reminders.controller';
import { jwtGuard } from '../../common/guards/jwt.guard';

const router = Router();
const controller = new RemindersController();

router.use(jwtGuard);

router.post('/', (req, res) => controller.create(req, res));
router.get('/pending', (req, res) => controller.listPending(req, res));
router.post('/:id/sent', (req, res) => controller.markAsSent(req, res));
router.post('/:id/cancel', (req, res) => controller.cancel(req, res));

export default router;
