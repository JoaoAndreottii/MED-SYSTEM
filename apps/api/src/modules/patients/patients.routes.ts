import { Router } from 'express';
import { PatientsController } from './patients.controller';
import { jwtGuard } from '../../common/guards/jwt.guard';

const router = Router();
const controller = new PatientsController();

router.use(jwtGuard);

router.post('/', (req, res) => controller.create(req, res));
router.get('/', (req, res) => controller.list(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.post('/:id/deactivate', (req, res) => controller.deactivate(req, res));

export default router;
