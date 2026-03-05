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
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
let S3Service = class S3Service {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
    }
    async uploadPrivateFile(file, key, contentType) {
        return;
    }
    async uploadPublicFile(file, key, contentType) {
        return { Location: `https://placeholder.s3.amazonaws.com/${key}` };
    }
    async generatePresignedUrl(key) {
        return '';
    }
    async deleteFile(key, isPublic = false) {
        return;
    }
    async getDownloadUrl(assetId, userId) {
        const purchase = await this.prisma.purchase.findFirst({
            where: {
                assetId,
                buyerId: userId,
                status: 'PAID',
            },
        });
        if (!purchase) {
            return null;
        }
        const asset = await this.prisma.asset.findUnique({
            where: { id: assetId },
        });
        if (!asset) {
            return null;
        }
        return null;
    }
    generateFileKey(assetId, fileName) {
        return `${assetId}/${fileName}`;
    }
    generatePreviewKey(assetId, fileName) {
        return `${assetId}/preview/${fileName}`;
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], S3Service);
//# sourceMappingURL=s3.service.js.map