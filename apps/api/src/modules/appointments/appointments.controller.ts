import { Request, Response } from 'express';
import { AppointmentService } from './appointments.service';

export class AppointmentController {
  private service = new AppointmentService();

  async create(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.create({ ...req.body, clinicId });
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.list(clinicId, req.query);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.findById(clinicId, req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const { status } = req.body;
      const result = await this.service.updateStatus(clinicId, req.params.id, status);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const { reason } = req.body;
      await this.service.cancel(clinicId, req.params.id, reason);
      res.json({ message: 'Appointment cancelled' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
