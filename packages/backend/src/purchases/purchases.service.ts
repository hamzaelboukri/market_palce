import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Purchase, Prisma, PurchaseStatus } from '@prisma/client';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PurchaseCreateInput): Promise<Purchase> {
    return this.prisma.purchase.create({
      data,
      include: {
        asset: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Purchase[]> {
    return this.prisma.purchase.findMany({
      include: {
        asset: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByBuyer(buyerId: string): Promise<Purchase[]> {
    return this.prisma.purchase.findMany({
      where: { buyerId },
      include: {
        asset: {
          select: {
            id: true,
            title: true,
            price: true,
            previewImageUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySeller(sellerId: string): Promise<Purchase[]> {
    return this.prisma.purchase.findMany({
      where: {
        asset: {
          sellerId,
        },
      },
      include: {
        asset: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Purchase | null> {
    return this.prisma.purchase.findUnique({
      where: { id },
      include: {
        asset: true,
        buyer: true,
      },
    });
  }

  async update(id: string, data: Prisma.PurchaseUpdateInput): Promise<Purchase> {
    return this.prisma.purchase.update({
      where: { id },
      data,
      include: {
        asset: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });
  }

  async getSellerRevenue(sellerId: string): Promise<{ total: number; currency: string }> {
    const result = await this.prisma.purchase.aggregate({
      where: {
        asset: {
          sellerId,
        },
        status: PurchaseStatus.PAID,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      total: result._sum.amount || 0,
      currency: 'USD',
    };
  }

  async getPurchaseStats(sellerId: string): Promise<{
    totalPurchases: number;
    totalRevenue: number;
    averagePrice: number;
  }> {
    const [totalPurchases, revenueResult] = await Promise.all([
      this.prisma.purchase.count({
        where: {
          asset: {
            sellerId,
          },
          status: PurchaseStatus.PAID,
        },
      }),
      this.prisma.purchase.aggregate({
        where: {
          asset: {
            sellerId,
          },
          status: PurchaseStatus.PAID,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const totalRevenue = revenueResult._sum.amount || 0;
    const averagePrice = totalPurchases > 0 ? totalRevenue / totalPurchases : 0;

    return {
      totalPurchases,
      totalRevenue,
      averagePrice,
    };
  }
}
