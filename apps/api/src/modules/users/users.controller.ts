import { Request, Response } from 'express';
import { UsersService } from './users.service';

export class UsersController {
  private service = new UsersService();

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
      if (!result) return res.status(404).json({ error: 'User not found' });
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async listByClinic(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.listByClinic(clinicId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async updateRole(req: Request, res: Response) {
    try {
      const { role } = req.body;
      const result = await this.service.updateRole(req.params.id, role);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async deactivate(req: Request, res: Response) {
    try {
      await this.service.deactivate(req.params.id);
      res.json({ message: 'User deactivated' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
