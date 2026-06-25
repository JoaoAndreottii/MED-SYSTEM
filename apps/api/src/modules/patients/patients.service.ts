import { prisma } from '../../server';

export interface CreatePatientInput {
  clinicId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  cpf: string;
}

export class PatientsService {
  async create(input: CreatePatientInput) {
    return prisma.patient.create({
      data: {
        clinicId: input.clinicId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        dateOfBirth: new Date(input.dateOfBirth),
        cpf: input.cpf,
        isActive: true,
        lastVisit: null,
      },
    });
  }

  async list(clinicId: string) {
    return prisma.patient.findMany({
      where: { clinicId, isActive: true },
      include: {
        appointments: { orderBy: { startTime: 'desc' }, take: 1 },
      },
    });
  }

  async findById(clinicId: string, id: string) {
    const patient = await prisma.patient.findFirst({
      where: { id, clinicId },
      include: {
        appointments: { orderBy: { startTime: 'desc' }, take: 10 },
      },
    });
    if (!patient) throw new Error('Patient not found');
    return patient;
  }

  async updateLastVisit(patientId: string) {
    return prisma.patient.update({
      where: { id: patientId },
      data: { lastVisit: new Date() },
    });
  }

  async deactivate(clinicId: string, id: string) {
    const patient = await this.findById(clinicId, id);
    return prisma.patient.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
