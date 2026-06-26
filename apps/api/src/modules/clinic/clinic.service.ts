import { getPrisma } from '../../lib/prisma';

export interface CreateClinicInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export class ClinicService {
  async create(input: CreateClinicInput) {
    return getPrisma().clinic.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        address: input.address,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
      },
    });
  }

  async findById(id: string) {
    const clinic = await getPrisma().clinic.findUnique({ where: { id } });
    if (!clinic) throw new Error('Clinic not found');
    return clinic;
  }

  async list() {
    return getPrisma().clinic.findMany({ where: { isActive: true } });
  }

  async update(id: string, input: Partial<CreateClinicInput>) {
    await this.findById(id);
    return getPrisma().clinic.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return getPrisma().clinic.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
