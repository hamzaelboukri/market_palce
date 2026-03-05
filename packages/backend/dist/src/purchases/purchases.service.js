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
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PurchasesService = class PurchasesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.purchase.create({
            data,
            include: {
                asset: {
                    include: {
                        seller: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async findAll() {
        return this.prisma.purchase.findMany({
            include: {
                asset: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByBuyer(buyerId) {
        return this.prisma.purchase.findMany({
            where: { buyerId },
            include: {
                asset: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        previewImageUrl: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findBySeller(sellerId) {
        return this.prisma.purchase.findMany({
            where: {
                asset: {
                    sellerId,
                },
            },
            include: {
                asset: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        return this.prisma.purchase.findUnique({
            where: { id },
            include: {
                asset: true,
                buyer: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.purchase.update({
            where: { id },
            data,
            include: {
                asset: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                    },
                },
            },
        });
    }
    async getSellerRevenue(sellerId) {
        const result = await this.prisma.purchase.aggregate({
            where: {
                asset: {
                    sellerId,
                },
                status: client_1.PurchaseStatus.PAID,
            },
            _sum: {
                amount: true,
            },
        });
        return {
            total: Number(result._sum.amount) || 0,
            currency: 'USD',
        };
    }
    async getPurchaseStats(sellerId) {
        const [totalPurchases, revenueResult] = await Promise.all([
            this.prisma.purchase.count({
                where: {
                    asset: {
                        sellerId,
                    },
                    status: client_1.PurchaseStatus.PAID,
                },
            }),
            this.prisma.purchase.aggregate({
                where: {
                    asset: {
                        sellerId,
                    },
                    status: client_1.PurchaseStatus.PAID,
                },
                _sum: {
                    amount: true,
                },
            }),
        ]);
        const totalRevenue = Number(revenueResult._sum.amount) || 0;
        const averagePrice = totalPurchases > 0 ? totalRevenue / totalPurchases : 0;
        return {
            totalPurchases,
            totalRevenue,
            averagePrice,
        };
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map