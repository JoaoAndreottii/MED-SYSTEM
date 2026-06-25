import { Request, Response } from 'express';
import { MarketingService } from './marketing.service';

export class MarketingController {
  private service = new MarketingService();

  async createCampaign(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.createCampaign({ ...req.body, clinicId });
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async listCampaigns(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.listCampaigns(clinicId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getCampaignMetrics(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.getCampaignMetrics(clinicId, req.params.campaignId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async endCampaign(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.endCampaign(clinicId, req.params.campaignId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
