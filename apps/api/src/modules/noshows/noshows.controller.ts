import { Request, Response } from 'express';
import { NoShowsService } from './noshows.service';

export class NoShowsController {
  private service = new NoShowsService();

  async recordNoShow(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.recordNoShow(clinicId, req.params.appointmentId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.getPatientNoShowStats(clinicId, req.params.patientId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async unblockPatient(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.unblockPatient(clinicId, req.params.patientId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
