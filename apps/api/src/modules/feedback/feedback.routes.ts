import { Router } from 'express';
import { FeedbackController } from './feedback.controller';
import { jwtGuard } from '../../common/guards/jwt.guard';

const router = Router();
const controller = new FeedbackController();

router.use(jwtGuard);

router.post('/', (req, res) => controller.createFeedback(req, res));
router.get('/', (req, res) => controller.listFeedback(req, res));
router.get('/average-rating', (req, res) => controller.getAverageRating(req, res));
router.get('/patient/:patientId', (req, res) => controller.getPatientFeedback(req, res));

export default router;
