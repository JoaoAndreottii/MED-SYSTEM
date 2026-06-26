import { getPrisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';
  clinicId: string;
}

export class UsersService {
  async create(input: CreateUserInput) {
    const existing = await getPrisma().user.findUnique({
      where: { email: input.email },
    });

    if (existing) throw new Error('Email already exists');

    const hashedPassword = await bcrypt.hash(input.password, 10);

    return getPrisma().user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
        role: input.role,
        clinics: {
          connect: { id: input.clinicId },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async findById(id: string) {
    return getPrisma().user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async listByClinic(clinicId: string) {
    return getPrisma().user.findMany({
      where: {
        clinics: {
          some: { id: clinicId },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async updateRole(userId: string, role: string) {
    return getPrisma().user.update({
      where: { id: userId },
      data: { role: role as any },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async deactivate(userId: string) {
    return getPrisma().user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }
}
