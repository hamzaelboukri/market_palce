import { PurchaseStatus } from '@prisma/client';
export declare class CreatePurchaseDto {
    amount: number;
    currency: string;
    status: PurchaseStatus;
    stripePaymentId?: string;
    buyerId: string;
    assetId: string;
}
