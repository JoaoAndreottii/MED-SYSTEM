import { Router } from 'express';
import { UsersController } from './users.controller';
import { jwtGuard } from '../../common/guards/jwt.guard';

const router = Router();
const controller = new UsersController();

router.use(jwtGuard);

router.post('/', (req, res) => controller.create(req, res));
router.get('/clinic/list', (req, res) => controller.listByClinic(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.patch('/:id/role', (req, res) => controller.updateRole(req, res));
router.delete('/:id', (req, res) => controller.deactivate(req, res));

export default router;
