import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
export declare class StripeService {
    private configService;
    private prisma;
    private stripe;
    constructor(configService: ConfigService, prisma: PrismaService);
    createCheckoutSession(assetId: string, userId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    verifyWebhook(rawBody: Buffer | string, signature: string): Stripe.Event;
    handleWebhook(event: Stripe.Event): Promise<void>;
    private handleSuccessfulPayment;
    createCustomer(email: string, name?: string): Promise<Stripe.Response<Stripe.Customer>>;
}
