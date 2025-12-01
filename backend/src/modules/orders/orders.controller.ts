import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderStatus } from '../../entities';
import { PharmaciesService } from '../pharmacies/pharmacies.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private pharmaciesService: PharmaciesService,
  ) {}

  @Post()
  create(@Request() req, @Body() body: any) {
    return this.ordersService.create(req.user.userId, body);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('status') status?: OrderStatus,
    @Query('pharmacyId') pharmacyId?: string,
  ) {
    // Clients see their orders, pharmacies see orders to them
    let effectivePharmacyId = pharmacyId;
    
    if (req.user.role === 'PHARMACY' && !pharmacyId) {
      // Auto-find pharmacy for pharmacy users
      const pharmacy = await this.pharmaciesService.findByUserId(req.user.userId);
      effectivePharmacyId = pharmacy?.id;
    }
    
    return this.ordersService.findAll({
      clientId: req.user.role === 'CLIENT' ? req.user.userId : undefined,
      pharmacyId: effectivePharmacyId,
      status,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get(':id/items')
  getOrderItems(@Param('id') id: string) {
    return this.ordersService.getOrderItems(id);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus; rejectionReason?: string },
  ) {
    return this.ordersService.updateStatus(id, body.status, body.rejectionReason);
  }
}
