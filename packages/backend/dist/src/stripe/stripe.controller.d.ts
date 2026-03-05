import { Request } from 'express';
import { StripeService } from './stripe.service';
import { AuthenticatedUser } from '../auth/auth.interface';
export declare class StripeController {
    private readonly stripeService;
    constructor(stripeService: StripeService);
    createCheckoutSession(assetId: string, req: {
        user: AuthenticatedUser;
    }): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Checkout.Session>>;
    handleWebhook(req: Request, signature: string): Promise<{
        received: boolean;
    }>;
}
