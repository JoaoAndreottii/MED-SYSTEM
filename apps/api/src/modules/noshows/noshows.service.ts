import { prisma } from '../../server';

export class NoShowsService {
  async recordNoShow(clinicId: string, appointmentId: string) {
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, clinicId },
    });

    if (!appointment) throw new Error('Appointment not found');

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'NO_SHOW' },
    });

    const patient = await prisma.patient.findUnique({
      where: { id: appointment.patientId },
    });

    if (patient) {
      const noShowCount = await prisma.appointment.count({
        where: {
          patientId: patient.id,
          status: 'NO_SHOW',
        },
      });

      if (noShowCount >= 3) {
        await prisma.patient.update({
          where: { id: patient.id },
          data: { isBlocked: true },
        });
      }
    }

    return { message: 'No-show recorded' };
  }

  async getPatientNoShowStats(clinicId: string, patientId: string) {
    const noShowCount = await prisma.appointment.count({
      where: {
        clinicId,
        patientId,
        status: 'NO_SHOW',
      },
    });

    const totalAppointments = await prisma.appointment.count({
      where: {
        clinicId,
        patientId,
      },
    });

    return {
      noShowCount,
      totalAppointments,
      noShowRate: totalAppointments > 0 ? (noShowCount / totalAppointments) * 100 : 0,
    };
  }

  async unblockPatient(clinicId: string, patientId: string) {
    const patient = await prisma.patient.findFirst({
      where: { id: patientId, clinicId },
    });

    if (!patient) throw new Error('Patient not found');

    return prisma.patient.update({
      where: { id: patientId },
      data: { isBlocked: false },
    });
  }
}
