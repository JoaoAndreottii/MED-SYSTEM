import { Router } from 'express';
import { FinancialController } from './financial.controller';
import { jwtGuard } from '../../common/guards/jwt.guard';

const router = Router();
const controller = new FinancialController();

router.use(jwtGuard);

router.post('/invoices', (req, res) => controller.createInvoice(req, res));
router.post('/invoices/:invoiceId/payment', (req, res) => controller.recordPayment(req, res));
router.get('/invoices', (req, res) => controller.listInvoices(req, res));
router.get('/revenue', (req, res) => controller.getRevenue(req, res));

export default router;
