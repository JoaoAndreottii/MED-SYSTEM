import { prisma } from '../../server';

export interface CreateInvoiceInput {
  clinicId: string;
  patientId: string;
  appointmentId?: string;
  amount: number;
  description: string;
  dueDate: string;
}

export class FinancialService {
  async createInvoice(input: CreateInvoiceInput) {
    return prisma.invoice.create({
      data: {
        clinicId: input.clinicId,
        patientId: input.patientId,
        appointmentId: input.appointmentId,
        amount: input.amount,
        description: input.description,
        dueDate: new Date(input.dueDate),
        status: 'PENDING',
        issuedAt: new Date(),
      },
    });
  }

  async recordPayment(clinicId: string, invoiceId: string, amount: number) {
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, clinicId },
    });

    if (!invoice) throw new Error('Invoice not found');

    const paidAmount = (invoice.paidAmount || 0) + amount;
    const isPaid = paidAmount >= invoice.amount;

    return prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount,
        status: isPaid ? 'PAID' : 'PARTIALLY_PAID',
        paidAt: isPaid ? new Date() : undefined,
      },
    });
  }

  async listInvoices(clinicId: string, filters?: any) {
    return prisma.invoice.findMany({
      where: {
        clinicId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.patientId && { patientId: filters.patientId }),
      },
      include: {
        patient: { select: { id: true, name: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async getClinicRevenue(clinicId: string, startDate?: Date, endDate?: Date) {
    const total = await prisma.invoice.aggregate({
      where: {
        clinicId,
        status: 'PAID',
        ...(startDate && endDate && {
          paidAt: { gte: startDate, lte: endDate },
        }),
      },
      _sum: { amount: true },
    });

    return { totalRevenue: total._sum.amount || 0 };
  }
}
