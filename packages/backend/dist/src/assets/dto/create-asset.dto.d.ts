import { AssetCategory } from '@prisma/client';
export declare class CreateAssetDto {
    id?: string;
    title: string;
    description: string;
    price: number;
    category: AssetCategory;
    tags: string[];
    sourceFileUrl: string;
    sourceFileName: string;
    sourceFileSize: number;
    previewImageUrl?: string;
    previewVideoUrl?: string;
}
