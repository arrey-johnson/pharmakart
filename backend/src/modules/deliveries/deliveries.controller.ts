import { Controller, Get, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeliveryStatus } from '../../entities';

@Controller('deliveries')
@UseGuards(JwtAuthGuard)
export class DeliveriesController {
  constructor(private deliveriesService: DeliveriesService) {}

  @Get()
  findAll(@Query('riderId') riderId?: string) {
    return this.deliveriesService.findAll(riderId);
  }

  @Get('pending')
  findPending() {
    return this.deliveriesService.findPending();
  }

  @Get('earnings')
  getEarnings(@Request() req) {
    return this.deliveriesService.getRiderEarnings(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveriesService.findOne(id);
  }

  @Put(':id/assign')
  assignRider(@Param('id') id: string, @Body() body: { riderId: string }) {
    return this.deliveriesService.assignRider(id, body.riderId);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: DeliveryStatus }) {
    return this.deliveriesService.updateStatus(id, body.status);
  }

  @Put(':id/rate')
  rateDelivery(@Param('id') id: string, @Body() body: { rating: number }) {
    return this.deliveriesService.rateDelivery(id, body.rating);
  }
}
