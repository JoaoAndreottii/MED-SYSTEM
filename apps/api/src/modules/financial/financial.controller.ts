import { Request, Response } from 'express';
import { FinancialService } from './financial.service';

export class FinancialController {
  private service = new FinancialService();

  async createInvoice(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.createInvoice({ ...req.body, clinicId });
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async recordPayment(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const { amount } = req.body;
      const result = await this.service.recordPayment(clinicId, req.params.invoiceId, amount);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async listInvoices(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.listInvoices(clinicId, req.query);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getRevenue(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      const result = await this.service.getClinicRevenue(clinicId, startDate, endDate);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
