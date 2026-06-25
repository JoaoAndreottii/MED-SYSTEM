import { prisma } from '../../server';

export interface CreateExamInput {
  clinicId: string;
  patientId: string;
  type: string;
  requestedBy: string;
  scheduledDate: string;
  notes?: string;
}

export class ExamsService {
  async scheduleExam(input: CreateExamInput) {
    return prisma.exam.create({
      data: {
        clinicId: input.clinicId,
        patientId: input.patientId,
        type: input.type,
        requestedBy: input.requestedBy,
        scheduledDate: new Date(input.scheduledDate),
        status: 'SCHEDULED',
        notes: input.notes,
      },
    });
  }

  async listExams(clinicId: string, patientId?: string) {
    return prisma.exam.findMany({
      where: {
        clinicId,
        ...(patientId && { patientId }),
      },
      include: {
        patient: { select: { id: true, name: true } },
      },
      orderBy: { scheduledDate: 'desc' },
    });
  }

  async uploadResult(clinicId: string, examId: string, resultUrl: string) {
    const exam = await prisma.exam.findFirst({
      where: { id: examId, clinicId },
    });

    if (!exam) throw new Error('Exam not found');

    return prisma.exam.update({
      where: { id: examId },
      data: {
        status: 'COMPLETED',
        resultUrl,
        completedAt: new Date(),
      },
    });
  }

  async getPatientExams(clinicId: string, patientId: string) {
    return prisma.exam.findMany({
      where: { clinicId, patientId },
      orderBy: { scheduledDate: 'desc' },
    });
  }
}
