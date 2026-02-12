import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum } from 'class-validator';
import { PurchaseStatus } from '@prisma/client';

export class CreatePurchaseDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty({ enum: PurchaseStatus })
  @IsEnum(PurchaseStatus)
  status: PurchaseStatus;

  @ApiProperty()
  @IsString()
  stripePaymentId?: string;

  @ApiProperty()
  @IsString()
  buyerId: string;

  @ApiProperty()
  @IsString()
  assetId: string;
}
