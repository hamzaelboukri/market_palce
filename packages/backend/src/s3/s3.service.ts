import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class S3Service {
  // S3 removed: no AWS fields

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    // S3 removed: no AWS initialization
  }

  async uploadPrivateFile(file: Buffer, key: string, contentType: string): Promise<void> {
    // S3 removed: stub implementation
    return;
  }

  async uploadPublicFile(file: Buffer, key: string, contentType: string): Promise<{ Location: string }> {
    // S3 stub: return placeholder URL when AWS not configured
    return { Location: `https://placeholder.s3.amazonaws.com/${key}` };
  }

  async generatePresignedUrl(key: string): Promise<string> {
    // S3 removed: stub implementation
    return '';
  }

  async deleteFile(key: string, isPublic = false): Promise<void> {
    // S3 removed: stub implementation
    return;
  }

  async getDownloadUrl(assetId: string, userId: string): Promise<string | null> {
    // Verify user has purchased the asset
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

    // Get asset to retrieve file key
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      return null;
    }

    // S3 removed: no download URL generation
    return null;
  }

  generateFileKey(assetId: string, fileName: string): string {
    // S3 removed: stub implementation
    return `${assetId}/${fileName}`;
  }

  generatePreviewKey(assetId: string, fileName: string): string {
    // S3 removed: stub implementation
    return `${assetId}/preview/${fileName}`;
  }
}
