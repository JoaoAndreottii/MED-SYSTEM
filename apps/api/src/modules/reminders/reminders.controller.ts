import { Request, Response } from 'express';
import { RemindersService } from './reminders.service';

export class RemindersController {
  private service = new RemindersService();

  async create(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.create({ ...req.body, clinicId });
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async listPending(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.listPending(clinicId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async markAsSent(req: Request, res: Response) {
    try {
      await this.service.markAsSent(req.params.id);
      res.json({ message: 'Reminder sent' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      await this.service.cancel(req.params.id);
      res.json({ message: 'Reminder cancelled' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
