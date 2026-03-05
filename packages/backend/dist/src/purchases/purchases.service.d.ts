import { PrismaService } from '../prisma/prisma.service';
import { Purchase, Prisma } from '@prisma/client';
export declare class PurchasesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.PurchaseCreateInput): Promise<Purchase>;
    findAll(): Promise<Purchase[]>;
    findByBuyer(buyerId: string): Promise<Purchase[]>;
    findBySeller(sellerId: string): Promise<Purchase[]>;
    findOne(id: string): Promise<Purchase | null>;
    update(id: string, data: Prisma.PurchaseUpdateInput): Promise<Purchase>;
    getSellerRevenue(sellerId: string): Promise<{
        total: number;
        currency: string;
    }>;
    getPurchaseStats(sellerId: string): Promise<{
        totalPurchases: number;
        totalRevenue: number;
        averagePrice: number;
    }>;
}
