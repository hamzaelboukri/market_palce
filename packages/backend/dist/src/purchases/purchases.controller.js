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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const purchases_service_1 = require("./purchases.service");
const create_purchase_dto_1 = require("./dto/create-purchase.dto");
const swagger_1 = require("@nestjs/swagger");
let PurchasesController = class PurchasesController {
    constructor(purchasesService) {
        this.purchasesService = purchasesService;
    }
    async create(createPurchaseDto, req) {
        return this.purchasesService.create({
            ...createPurchaseDto,
            buyer: {
                connect: { id: req.user.id }
            },
            asset: {
                connect: { id: createPurchaseDto.assetId }
            },
        });
    }
    async findAll() {
        return this.purchasesService.findAll();
    }
    async getMyPurchases(req) {
        return this.purchasesService.findByBuyer(req.user.id);
    }
    async getMySales(req) {
        return this.purchasesService.findBySeller(req.user.id);
    }
    async getMyRevenue(req) {
        return this.purchasesService.getSellerRevenue(req.user.id);
    }
    async getMyStats(req) {
        return this.purchasesService.getPurchaseStats(req.user.id);
    }
    async findOne(id) {
        return this.purchasesService.findOne(id);
    }
};
exports.PurchasesController = PurchasesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new purchase' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Purchase created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_purchase_dto_1.CreatePurchaseDto, Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all purchases (admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Purchases retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-purchases'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user\'s purchases' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User purchases retrieved' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "getMyPurchases", null);
__decorate([
    (0, common_1.Get)('my-sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user\'s sales' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User sales retrieved' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "getMySales", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user\'s revenue' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User revenue retrieved' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "getMyRevenue", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user\'s purchase stats' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User stats retrieved' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "getMyStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get purchase by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Purchase retrieved' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "findOne", null);
exports.PurchasesController = PurchasesController = __decorate([
    (0, swagger_1.ApiTags)('purchases'),
    (0, common_1.Controller)('purchases'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [purchases_service_1.PurchasesService])
], PurchasesController);
//# sourceMappingURL=purchases.controller.js.map