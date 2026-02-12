import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Asset, Prisma, AssetCategory, AssetStatus } from '@prisma/client';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AssetCreateInput): Promise<Asset> {
    return this.prisma.asset.create({
      data,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AssetWhereUniqueInput;
    where?: Prisma.AssetWhereInput;
    orderBy?: Prisma.AssetOrderByWithRelationInput;
    category?: AssetCategory;
    search?: string;
  }): Promise<{ assets: Asset[]; total: number }> {
    const { skip, take, cursor, where, orderBy, category, search } = params;
    
    const whereClause: Prisma.AssetWhereInput = {
      ...where,
      status: AssetStatus.ACTIVE,
    };

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const [assets, total] = await Promise.all([
      this.prisma.asset.findMany({
        skip,
        take,
        cursor,
        where: whereClause,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              purchases: true,
              reviews: true,
            },
          },
        },
      }),
      this.prisma.asset.count({ where: whereClause }),
    ]);

    return { assets, total };
  }

  async findOne(id: string): Promise<Asset | null> {
    return this.prisma.asset.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            purchases: true,
            reviews: true,
          },
        },
      },
    });
  }

  async findBySeller(sellerId: string): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      where: { sellerId },
      include: {
        _count: {
          select: {
            purchases: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Prisma.AssetUpdateInput): Promise<Asset> {
    return this.prisma.asset.update({
      where: { id },
      data,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<Asset> {
    return this.prisma.asset.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: AssetStatus): Promise<Asset> {
    return this.prisma.asset.update({
      where: { id },
      data: { status },
    });
  }

  async getFeaturedAssets(limit = 6): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      where: { status: AssetStatus.ACTIVE },
      orderBy: { downloadsCount: 'desc' },
      take: limit,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            purchases: true,
            reviews: true,
          },
        },
      },
    });
  }
}
