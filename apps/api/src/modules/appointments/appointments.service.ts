import { prisma } from '../../server';

export interface CreateAppointmentInput {
  clinicId: string;
  patientId: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

export class AppointmentService {
  async create(input: CreateAppointmentInput) {
    await this.checkConflicts(input.doctorId, input.startTime, input.endTime);

    return prisma.appointment.create({
      data: {
        clinicId: input.clinicId,
        patientId: input.patientId,
        doctorId: input.doctorId,
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
        reason: input.reason,
        status: 'SCHEDULED',
      },
      include: {
        patient: { select: { id: true, name: true, phone: true } },
        doctor: { select: { id: true, name: true } },
      },
    });
  }

  async list(clinicId: string, filters?: any) {
    return prisma.appointment.findMany({
      where: {
        clinicId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.patientId && { patientId: filters.patientId }),
        ...(filters?.doctorId && { doctorId: filters.doctorId }),
      },
      include: {
        patient: { select: { id: true, name: true, phone: true } },
        doctor: { select: { id: true, name: true } },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findById(clinicId: string, id: string) {
    const appointment = await prisma.appointment.findFirst({
      where: { id, clinicId },
      include: {
        patient: true,
        doctor: { select: { id: true, name: true } },
      },
    });
    if (!appointment) throw new Error('Appointment not found');
    return appointment;
  }

  async updateStatus(clinicId: string, id: string, status: string) {
    await this.findById(clinicId, id);
    return prisma.appointment.update({
      where: { id },
      data: { status: status as any },
      include: {
        patient: { select: { id: true, name: true, phone: true } },
        doctor: { select: { id: true, name: true } },
      },
    });
  }

  async cancel(clinicId: string, id: string, reason: string) {
    const appointment = await this.findById(clinicId, id);
    return prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });
  }

  private async checkConflicts(doctorId: string, startTime: string, endTime: string) {
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] },
        OR: [
          {
            startTime: { lte: new Date(endTime) },
            endTime: { gte: new Date(startTime) },
          },
        ],
      },
    });

    if (conflict) throw new Error('Doctor has conflicting appointment');
  }
}
