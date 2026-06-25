import { Request, Response } from 'express';
import { ClinicService } from './clinic.service';

export class ClinicController {
  private service = new ClinicService();

  async create(req: Request, res: Response) {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const result = await this.service.findById(req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const result = await this.service.list();
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const result = await this.service.update(req.params.id, req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.service.delete(req.params.id);
      res.json({ message: 'Clinic deleted' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
