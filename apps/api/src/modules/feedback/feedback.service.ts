import { prisma } from '../../server';

export interface CreateFeedbackInput {
  clinicId: string;
  appointmentId: string;
  patientId: string;
  rating: number;
  comment?: string;
}

export class FeedbackService {
  async createFeedback(input: CreateFeedbackInput) {
    if (input.rating < 1 || input.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    return prisma.postConsultationFeedback.create({
      data: {
        clinicId: input.clinicId,
        appointmentId: input.appointmentId,
        patientId: input.patientId,
        rating: input.rating,
        comment: input.comment,
        submittedAt: new Date(),
      },
    });
  }

  async listFeedback(clinicId: string) {
    return prisma.postConsultationFeedback.findMany({
      where: { clinicId },
      include: {
        patient: { select: { id: true, name: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async getAverageRating(clinicId: string) {
    const result = await prisma.postConsultationFeedback.aggregate({
      where: { clinicId },
      _avg: { rating: true },
      _count: true,
    });

    return {
      averageRating: result._avg.rating || 0,
      totalFeedback: result._count,
    };
  }

  async getPatientFeedback(clinicId: string, patientId: string) {
    return prisma.postConsultationFeedback.findMany({
      where: { clinicId, patientId },
      orderBy: { submittedAt: 'desc' },
    });
  }
}
