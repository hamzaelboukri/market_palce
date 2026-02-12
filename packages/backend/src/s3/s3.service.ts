import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AWS from 'aws-sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private publicS3: AWS.S3;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    AWS.config.update({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });

    this.s3 = new AWS.S3();
    this.publicS3 = new AWS.S3();
  }

  async uploadPrivateFile(file: Buffer, key: string, contentType: string) {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');
    
    return this.s3.upload({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'private',
    }).promise();
  }

  async uploadPublicFile(file: Buffer, key: string, contentType: string) {
    const bucket = this.configService.get<string>('AWS_S3_PUBLIC_BUCKET');
    
    return this.publicS3.upload({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read',
    }).promise();
  }

  async generatePresignedUrl(key: string): Promise<string> {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');
    
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: 300, // 5 minutes
    });
  }

  async deleteFile(key: string, isPublic = false) {
    const bucket = isPublic 
      ? this.configService.get<string>('AWS_S3_PUBLIC_BUCKET')
      : this.configService.get<string>('AWS_S3_BUCKET');

    return (isPublic ? this.publicS3 : this.s3).deleteObject({
      Bucket: bucket,
      Key: key,
    }).promise();
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

    // Generate presigned URL
    const downloadUrl = await this.generatePresignedUrl(asset.sourceFileUrl);
    
    // Update purchase with download URL and expiry
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await this.prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        downloadUrl,
        downloadExpires: expiresAt,
      },
    });

    return downloadUrl;
  }

  generateFileKey(assetId: string, fileName: string): string {
    return `assets/${assetId}/${fileName}`;
  }

  generatePreviewKey(assetId: string, fileName: string): string {
    return `previews/${assetId}/${fileName}`;
  }
}
