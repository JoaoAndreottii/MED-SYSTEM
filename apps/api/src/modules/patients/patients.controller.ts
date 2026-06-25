import { Request, Response } from 'express';
import { PatientsService } from './patients.service';

export class PatientsController {
  private service = new PatientsService();

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
      const result = await this.service.list(clinicId);
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

  async deactivate(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      await this.service.deactivate(clinicId, req.params.id);
      res.json({ message: 'Patient deactivated' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
