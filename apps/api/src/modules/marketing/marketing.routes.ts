import { Router } from 'express';
import { MarketingController } from './marketing.controller';
import { jwtGuard } from '../../common/guards/jwt.guard';

const router = Router();
const controller = new MarketingController();

router.use(jwtGuard);

router.post('/', (req, res) => controller.createCampaign(req, res));
router.get('/', (req, res) => controller.listCampaigns(req, res));
router.get('/:campaignId/metrics', (req, res) => controller.getCampaignMetrics(req, res));
router.post('/:campaignId/end', (req, res) => controller.endCampaign(req, res));

export default router;
