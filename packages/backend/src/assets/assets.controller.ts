import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthenticatedUser } from '../auth/auth.interface';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully' })
  async create(@Body() createAssetDto: CreateAssetDto, @Request() req: { user: AuthenticatedUser }) {
    return this.assetsService.create({
      ...createAssetDto,
      seller: {
        connect: { id: req.user.id }
      },
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all assets with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Assets retrieved successfully' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '12',
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('sort') sort: string = 'createdAt',
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    
    const orderBy: any = {};
    if (sort === 'price') {
      orderBy.price = 'asc';
    } else if (sort === 'downloads') {
      orderBy.downloadsCount = 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    return this.assetsService.findAll({
      skip,
      take,
      category: category as any,
      search,
      orderBy,
    });
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured assets' })
  @ApiResponse({ status: 200, description: 'Featured assets retrieved' })
  async getFeatured() {
    return this.assetsService.getFeaturedAssets();
  }

  @Get('my-assets')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current user\'s assets' })
  @ApiResponse({ status: 200, description: 'User assets retrieved' })
  async getMyAssets(@Request() req) {
    return this.assetsService.findBySeller(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset by ID' })
  @ApiResponse({ status: 200, description: 'Asset retrieved' })
  async findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update asset' })
  @ApiResponse({ status: 200, description: 'Asset updated' })
  async update(
    @Param('id') id: string,
    @Body() updateAssetDto: UpdateAssetDto,
    @Request() req,
  ) {
    // Verify ownership
    const asset = await this.assetsService.findOne(id);
    if (asset.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new Error('Unauthorized to update this asset');
    }

    return this.assetsService.update(id, updateAssetDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete asset' })
  @ApiResponse({ status: 200, description: 'Asset deleted' })
  async remove(@Param('id') id: string, @Request() req) {
    // Verify ownership
    const asset = await this.assetsService.findOne(id);
    if (asset.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new Error('Unauthorized to delete this asset');
    }

    return this.assetsService.remove(id);
  }
}
