import { prisma } from '../../server';
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
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) throw new Error('Email already exists');

    const hashedPassword = await bcrypt.hash(input.password, 10);

    return prisma.user.create({
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
    return prisma.user.findUnique({
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
    return prisma.user.findMany({
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
    return prisma.user.update({
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
    return prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }
}
