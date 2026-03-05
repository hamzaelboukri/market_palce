import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class S3Service {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    uploadPrivateFile(file: Buffer, key: string, contentType: string): Promise<void>;
    uploadPublicFile(file: Buffer, key: string, contentType: string): Promise<{
        Location: string;
    }>;
    generatePresignedUrl(key: string): Promise<string>;
    deleteFile(key: string, isPublic?: boolean): Promise<void>;
    getDownloadUrl(assetId: string, userId: string): Promise<string | null>;
    generateFileKey(assetId: string, fileName: string): string;
    generatePreviewKey(assetId: string, fileName: string): string;
}
