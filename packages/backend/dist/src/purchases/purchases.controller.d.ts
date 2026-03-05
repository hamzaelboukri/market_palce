import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { AuthenticatedUser } from '../auth/auth.interface';
export declare class PurchasesController {
    private readonly purchasesService;
    constructor(purchasesService: PurchasesService);
    create(createPurchaseDto: CreatePurchaseDto, req: {
        user: AuthenticatedUser;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PurchaseStatus;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        stripePaymentId: string | null;
        downloadUrl: string | null;
        downloadExpires: Date | null;
        buyerId: string;
        assetId: string;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PurchaseStatus;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        stripePaymentId: string | null;
        downloadUrl: string | null;
        downloadExpires: Date | null;
        buyerId: string;
        assetId: string;
    }[]>;
    getMyPurchases(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PurchaseStatus;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        stripePaymentId: string | null;
        downloadUrl: string | null;
        downloadExpires: Date | null;
        buyerId: string;
        assetId: string;
    }[]>;
    getMySales(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PurchaseStatus;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        stripePaymentId: string | null;
        downloadUrl: string | null;
        downloadExpires: Date | null;
        buyerId: string;
        assetId: string;
    }[]>;
    getMyRevenue(req: any): Promise<{
        total: number;
        currency: string;
    }>;
    getMyStats(req: any): Promise<{
        totalPurchases: number;
        totalRevenue: number;
        averagePrice: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PurchaseStatus;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        stripePaymentId: string | null;
        downloadUrl: string | null;
        downloadExpires: Date | null;
        buyerId: string;
        assetId: string;
    }>;
}
