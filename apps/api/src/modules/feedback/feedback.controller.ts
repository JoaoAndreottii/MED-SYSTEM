import { Request, Response } from 'express';
import { FeedbackService } from './feedback.service';

export class FeedbackController {
  private service = new FeedbackService();

  async createFeedback(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.createFeedback({ ...req.body, clinicId });
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async listFeedback(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.listFeedback(clinicId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAverageRating(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.getAverageRating(clinicId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getPatientFeedback(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.getPatientFeedback(clinicId, req.params.patientId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
