import { prisma } from '../../server';

export interface CreateCampaignInput {
  clinicId: string;
  name: string;
  description: string;
  targetAudience: string;
  budget: number;
  startDate: string;
  endDate: string;
}

export class MarketingService {
  async createCampaign(input: CreateCampaignInput) {
    return prisma.marketingCampaign.create({
      data: {
        clinicId: input.clinicId,
        name: input.name,
        description: input.description,
        targetAudience: input.targetAudience,
        budget: input.budget,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        status: 'ACTIVE',
      },
    });
  }

  async listCampaigns(clinicId: string) {
    return prisma.marketingCampaign.findMany({
      where: { clinicId },
      orderBy: { startDate: 'desc' },
    });
  }

  async getCampaignMetrics(clinicId: string, campaignId: string) {
    const campaign = await prisma.marketingCampaign.findFirst({
      where: { id: campaignId, clinicId },
    });

    if (!campaign) throw new Error('Campaign not found');

    const newPatients = await prisma.patient.count({
      where: {
        clinicId,
        createdAt: {
          gte: campaign.startDate,
          lte: campaign.endDate,
        },
      },
    });

    return {
      campaign,
      newPatients,
      roi: newPatients > 0 ? ((newPatients * 100) / campaign.budget).toFixed(2) : 0,
    };
  }

  async endCampaign(clinicId: string, campaignId: string) {
    const campaign = await prisma.marketingCampaign.findFirst({
      where: { id: campaignId, clinicId },
    });

    if (!campaign) throw new Error('Campaign not found');

    return prisma.marketingCampaign.update({
      where: { id: campaignId },
      data: { status: 'ENDED', endDate: new Date() },
    });
  }
}
