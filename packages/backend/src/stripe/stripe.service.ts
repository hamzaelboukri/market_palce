import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(assetId: string, userId: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new Error('Asset not found');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: asset.title,
              description: asset.description,
            },
            unit_amount: Math.round(Number(asset.price) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: this.configService.get<string>('STRIPE_SUCCESS_URL'),
      cancel_url: this.configService.get<string>('STRIPE_CANCEL_URL'),
      metadata: {
        assetId,
        userId,
      },
    });

    return session;
  }

  verifyWebhook(rawBody: Buffer | string, signature: string): Stripe.Event {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    return this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleSuccessfulPayment(session);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleSuccessfulPayment(session: Stripe.Checkout.Session) {
    const { assetId, userId } = session.metadata;
    const stripePaymentId = session.id;

    // Create purchase record
    await this.prisma.purchase.create({
      data: {
        amount: session.amount_total / 100,
        currency: session.currency,
        status: 'PAID',
        stripePaymentId,
        buyerId: userId,
        assetId,
      },
    });

    // Update asset download count
    await this.prisma.asset.update({
      where: { id: assetId },
      data: {
        downloadsCount: {
          increment: 1,
        },
      },
    });
  }

  async createCustomer(email: string, name?: string) {
    return this.stripe.customers.create({
      email,
      name,
    });
  }
}
