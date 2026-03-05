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
exports.S3Controller = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const passport_1 = require("@nestjs/passport");
const s3_service_1 = require("./s3.service");
const swagger_1 = require("@nestjs/swagger");
let S3Controller = class S3Controller {
    constructor(s3Service) {
        this.s3Service = s3Service;
    }
    async uploadSourceFile(file, assetId) {
        const key = this.s3Service.generateFileKey(assetId, file.originalname);
        await this.s3Service.uploadPrivateFile(file.buffer, key, file.mimetype);
        return {
            key,
            fileName: file.originalname,
            fileSize: file.size,
        };
    }
    async uploadPreviewFile(file, assetId) {
        const key = this.s3Service.generatePreviewKey(assetId, file.originalname);
        const result = await this.s3Service.uploadPublicFile(file.buffer, key, file.mimetype);
        return {
            url: result.Location,
            key,
            fileName: file.originalname,
        };
    }
    async getDownloadUrl(assetId, req) {
        const userId = req.user.id;
        const downloadUrl = await this.s3Service.getDownloadUrl(assetId, userId);
        if (!downloadUrl) {
            return { error: 'Access denied or asset not purchased' };
        }
        return { downloadUrl };
    }
};
exports.S3Controller = S3Controller;
__decorate([
    (0, common_1.Post)('upload-source'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload private source file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File uploaded successfully' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('assetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "uploadSourceFile", null);
__decorate([
    (0, common_1.Post)('upload-preview'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload public preview file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Preview uploaded successfully' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('assetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "uploadPreviewFile", null);
__decorate([
    (0, common_1.Get)('download/:assetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get download URL for purchased asset' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Download URL generated' }),
    __param(0, (0, common_1.Param)('assetId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], S3Controller.prototype, "getDownloadUrl", null);
exports.S3Controller = S3Controller = __decorate([
    (0, swagger_1.ApiTags)('s3'),
    (0, common_1.Controller)('s3'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [s3_service_1.S3Service])
], S3Controller);
//# sourceMappingURL=s3.controller.js.map