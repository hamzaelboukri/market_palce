import { S3Service } from './s3.service';
import { AuthenticatedUser } from '../auth/auth.interface';
export declare class S3Controller {
    private readonly s3Service;
    constructor(s3Service: S3Service);
    uploadSourceFile(file: Express.Multer.File, assetId: string): Promise<{
        key: string;
        fileName: string;
        fileSize: number;
    }>;
    uploadPreviewFile(file: Express.Multer.File, assetId: string): Promise<{
        url: string;
        key: string;
        fileName: string;
    }>;
    getDownloadUrl(assetId: string, req: {
        user: AuthenticatedUser;
    }): Promise<{
        error: string;
        downloadUrl?: undefined;
    } | {
        downloadUrl: string;
        error?: undefined;
    }>;
}
