import { prisma } from '../../server';

export interface CreateReminderInput {
  clinicId: string;
  patientId: string;
  appointmentId?: string;
  type: 'APPOINTMENT' | 'PRESCRIPTION' | 'EXAM' | 'FOLLOW_UP';
  sendDate: string;
  message: string;
}

export class RemindersService {
  async create(input: CreateReminderInput) {
    return prisma.reminder.create({
      data: {
        clinicId: input.clinicId,
        patientId: input.patientId,
        appointmentId: input.appointmentId,
        type: input.type,
        sendDate: new Date(input.sendDate),
        message: input.message,
        status: 'PENDING',
      },
    });
  }

  async listPending(clinicId: string) {
    return prisma.reminder.findMany({
      where: {
        clinicId,
        status: 'PENDING',
        sendDate: { lte: new Date() },
      },
      include: {
        patient: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  async markAsSent(id: string) {
    return prisma.reminder.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date() },
    });
  }

  async markAsFailed(id: string, error: string) {
    return prisma.reminder.update({
      where: { id },
      data: { status: 'FAILED', lastError: error },
    });
  }

  async cancel(id: string) {
    return prisma.reminder.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
