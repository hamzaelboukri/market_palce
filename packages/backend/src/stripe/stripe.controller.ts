import {
  Controller,
  Post,
  Body,
  Headers,
  Res,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { StripeService } from './stripe.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthenticatedUser } from '../auth/auth.interface';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @Post('create-checkout-session/:assetId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create Stripe checkout session' })
  @ApiResponse({ status: 200, description: 'Checkout session created' })
  async createCheckoutSession(
    @Param('assetId') assetId: string,
    @Req() req: { user: AuthenticatedUser },
  ) {
    const userId = req.user.id;
    return this.stripeService.createCheckoutSession(assetId, userId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhook' })
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }

    try {
      const event = this.stripeService.verifyWebhook(req.body, signature);
      await this.stripeService.handleWebhook(event);
      return { received: true };
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error('Webhook Error');
    }
  }
}
