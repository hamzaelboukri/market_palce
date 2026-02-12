import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsEnum, IsOptional } from 'class-validator';
import { AssetCategory } from '@prisma/client';

export class CreateAssetDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ enum: AssetCategory })
  @IsEnum(AssetCategory)
  category: AssetCategory;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsString()
  sourceFileUrl: string;

  @ApiProperty()
  @IsString()
  sourceFileName: string;

  @ApiProperty()
  @IsNumber()
  sourceFileSize: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  previewImageUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  previewVideoUrl?: string;
}
