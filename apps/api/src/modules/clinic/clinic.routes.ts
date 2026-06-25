import { Router } from 'express';
import { ClinicController } from './clinic.controller';
import { jwtGuard } from '../../common/guards/jwt.guard';

const router = Router();
const controller = new ClinicController();

router.use(jwtGuard);

router.post('/', (req, res) => controller.create(req, res));
router.get('/', (req, res) => controller.list(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.patch('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export default router;
