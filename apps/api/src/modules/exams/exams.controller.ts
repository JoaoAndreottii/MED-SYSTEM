import { Request, Response } from 'express';
import { ExamsService } from './exams.service';

export class ExamsController {
  private service = new ExamsService();

  async scheduleExam(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const userId = (req as any).userId;
      const result = await this.service.scheduleExam({
        ...req.body,
        clinicId,
        requestedBy: userId,
      });
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async listExams(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const patientId = req.query.patientId as string | undefined;
      const result = await this.service.listExams(clinicId, patientId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async uploadResult(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const { resultUrl } = req.body;
      const result = await this.service.uploadResult(clinicId, req.params.examId, resultUrl);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getPatientExams(req: Request, res: Response) {
    try {
      const clinicId = (req as any).clinicId;
      const result = await this.service.getPatientExams(clinicId, req.params.patientId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
