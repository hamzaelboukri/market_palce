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
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AssetsService = class AssetsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.asset.create({
            data,
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async findAll(params) {
        const { skip, take, cursor, where, orderBy, category, search } = params;
        const whereClause = {
            ...where,
            status: client_1.AssetStatus.ACTIVE,
        };
        if (category) {
            whereClause.category = category;
        }
        if (search) {
            whereClause.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { has: search } },
            ];
        }
        const [assets, total] = await Promise.all([
            this.prisma.asset.findMany({
                skip,
                take,
                cursor,
                where: whereClause,
                orderBy: orderBy || { createdAt: 'desc' },
                include: {
                    seller: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: {
                            purchases: true,
                            reviews: true,
                        },
                    },
                },
            }),
            this.prisma.asset.count({ where: whereClause }),
        ]);
        return { assets, total };
    }
    async findOne(id) {
        return this.prisma.asset.findUnique({
            where: { id },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                _count: {
                    select: {
                        purchases: true,
                        reviews: true,
                    },
                },
            },
        });
    }
    async findBySeller(sellerId) {
        return this.prisma.asset.findMany({
            where: { sellerId },
            include: {
                _count: {
                    select: {
                        purchases: true,
                        reviews: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, data) {
        return this.prisma.asset.update({
            where: { id },
            data,
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async remove(id) {
        return this.prisma.asset.delete({
            where: { id },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.asset.update({
            where: { id },
            data: { status },
        });
    }
    async getFeaturedAssets(limit = 6) {
        return this.prisma.asset.findMany({
            where: { status: client_1.AssetStatus.ACTIVE },
            orderBy: { downloadsCount: 'desc' },
            take: limit,
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        purchases: true,
                        reviews: true,
                    },
                },
            },
        });
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map