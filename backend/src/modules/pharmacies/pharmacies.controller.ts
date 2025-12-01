import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PharmaciesService } from './pharmacies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pharmacies')
export class PharmaciesController {
  constructor(private pharmaciesService: PharmaciesService) {}

  @Get()
  findAll(@Query('verified') verified: string) {
    return this.pharmaciesService.findAll(verified !== 'false');
  }

  // Verify a pharmacy (admin action - for now open for testing)
  @Put(':id/verify')
  verifyPharmacy(@Param('id') id: string) {
    return this.pharmaciesService.update(id, { isVerified: true });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pharmaciesService.findOne(id);
  }

  @Get(':id/inventory')
  getInventory(@Param('id') id: string) {
    return this.pharmaciesService.getInventory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/inventory')
  addMedicine(
    @Param('id') id: string,
    @Body() body: { medicineId: string; price: number; stockQuantity: number },
  ) {
    return this.pharmaciesService.addMedicine(id, body.medicineId, body.price, body.stockQuantity);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/inventory/create')
  createMedicineAndAdd(
    @Param('id') id: string,
    @Body() body: {
      medicine: {
        name: string;
        genericName?: string;
        categoryId?: string;
        description?: string;
        dosage?: string;
        packaging?: string;
        prescriptionRequired?: boolean;
      };
      price: number;
      stockQuantity: number;
    },
  ) {
    return this.pharmaciesService.createMedicineAndAdd(
      id,
      body.medicine,
      body.price,
      body.stockQuantity,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.pharmaciesService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.pharmaciesService.getStats(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/low-stock')
  getLowStock(@Param('id') id: string, @Query('threshold') threshold?: string) {
    return this.pharmaciesService.getLowStock(id, threshold ? parseInt(threshold) : 10);
  }

  @UseGuards(JwtAuthGuard)
  @Put('inventory/:itemId/stock')
  updateStock(@Param('itemId') itemId: string, @Body() body: { stockQuantity: number }) {
    return this.pharmaciesService.updateStock(itemId, body.stockQuantity);
  }

  @UseGuards(JwtAuthGuard)
  @Get('inventory/:itemId')
  getInventoryItem(@Param('itemId') itemId: string) {
    return this.pharmaciesService.getInventoryItem(itemId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('inventory/:itemId')
  updateInventoryItem(
    @Param('itemId') itemId: string,
    @Body() body: {
      medicine: {
        name?: string;
        genericName?: string;
        categoryId?: string;
        description?: string;
        dosage?: string;
        packaging?: string;
        prescriptionRequired?: boolean;
      };
      price?: number;
      stockQuantity?: number;
    },
  ) {
    return this.pharmaciesService.updateInventoryItem(
      itemId,
      body.medicine || {},
      { price: body.price, stockQuantity: body.stockQuantity },
    );
  }
}
