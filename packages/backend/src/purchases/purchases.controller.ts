import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('purchases')
@Controller('purchases')
@UseGuards(AuthGuard('jwt'))
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new purchase' })
  @ApiResponse({ status: 201, description: 'Purchase created successfully' })
  async create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchasesService.create(createPurchaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all purchases (admin only)' })
  @ApiResponse({ status: 200, description: 'Purchases retrieved' })
  async findAll() {
    return this.purchasesService.findAll();
  }

  @Get('my-purchases')
  @ApiOperation({ summary: 'Get current user\'s purchases' })
  @ApiResponse({ status: 200, description: 'User purchases retrieved' })
  async getMyPurchases(@Request() req) {
    return this.purchasesService.findByBuyer(req.user.id);
  }

  @Get('my-sales')
  @ApiOperation({ summary: 'Get current user\'s sales' })
  @ApiResponse({ status: 200, description: 'User sales retrieved' })
  async getMySales(@Request() req) {
    return this.purchasesService.findBySeller(req.user.id);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get current user\'s revenue' })
  @ApiResponse({ status: 200, description: 'User revenue retrieved' })
  async getMyRevenue(@Request() req) {
    return this.purchasesService.getSellerRevenue(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get current user\'s purchase stats' })
  @ApiResponse({ status: 200, description: 'User stats retrieved' })
  async getMyStats(@Request() req) {
    return this.purchasesService.getPurchaseStats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get purchase by ID' })
  @ApiResponse({ status: 200, description: 'Purchase retrieved' })
  async findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(id);
  }
}
