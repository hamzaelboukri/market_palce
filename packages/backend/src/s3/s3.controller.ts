import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { S3Service } from './s3.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';

@ApiTags('s3')
@Controller('s3')
@UseGuards(AuthGuard('jwt'))
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload-source')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload private source file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'File uploaded successfully' })
  async uploadSourceFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('assetId') assetId: string,
  ) {
    const key = this.s3Service.generateFileKey(assetId, file.originalname);
    await this.s3Service.uploadPrivateFile(file.buffer, key, file.mimetype);
    
    return {
      key,
      fileName: file.originalname,
      fileSize: file.size,
    };
  }

  @Post('upload-preview')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload public preview file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Preview uploaded successfully' })
  async uploadPreviewFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('assetId') assetId: string,
  ) {
    const key = this.s3Service.generatePreviewKey(assetId, file.originalname);
    const result = await this.s3Service.uploadPublicFile(file.buffer, key, file.mimetype);
    
    return {
      url: result.Location,
      key,
      fileName: file.originalname,
    };
  }

  @Get('download/:assetId')
  @ApiOperation({ summary: 'Get download URL for purchased asset' })
  @ApiResponse({ status: 200, description: 'Download URL generated' })
  async getDownloadUrl(
    @Param('assetId') assetId: string,
    @Req() req: Request,
  ) {
    const userId = req.user.id;
    const downloadUrl = await this.s3Service.getDownloadUrl(assetId, userId);
    
    if (!downloadUrl) {
      return { error: 'Access denied or asset not purchased' };
    }
    
    return { downloadUrl };
  }
}
