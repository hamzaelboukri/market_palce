import { PrismaService } from '../prisma/prisma.service';
import { Asset, Prisma, AssetCategory, AssetStatus } from '@prisma/client';
export declare class AssetsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.AssetCreateInput): Promise<Asset>;
    findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.AssetWhereUniqueInput;
        where?: Prisma.AssetWhereInput;
        orderBy?: Prisma.AssetOrderByWithRelationInput;
        category?: AssetCategory;
        search?: string;
    }): Promise<{
        assets: Asset[];
        total: number;
    }>;
    findOne(id: string): Promise<Asset | null>;
    findBySeller(sellerId: string): Promise<Asset[]>;
    update(id: string, data: Prisma.AssetUpdateInput): Promise<Asset>;
    remove(id: string): Promise<Asset>;
    updateStatus(id: string, status: AssetStatus): Promise<Asset>;
    getFeaturedAssets(limit?: number): Promise<Asset[]>;
}
