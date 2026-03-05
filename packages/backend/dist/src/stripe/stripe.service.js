"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
const prisma_service_1 = require("../prisma/prisma.service");
let StripeService = class StripeService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2023-10-16',
        });
    }
    async createCheckoutSession(assetId, userId) {
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
            success_url: this.configService.get('STRIPE_SUCCESS_URL'),
            cancel_url: this.configService.get('STRIPE_CANCEL_URL'),
            metadata: {
                assetId,
                userId,
            },
        });
        return session;
    }
    verifyWebhook(rawBody, signature) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        return this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    }
    async handleWebhook(event) {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                await this.handleSuccessfulPayment(session);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }
    async handleSuccessfulPayment(session) {
        const { assetId, userId } = session.metadata;
        const stripePaymentId = session.id;
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
        await this.prisma.asset.update({
            where: { id: assetId },
            data: {
                downloadsCount: {
                    increment: 1,
                },
            },
        });
    }
    async createCustomer(email, name) {
        return this.stripe.customers.create({
            email,
            name,
        });
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map