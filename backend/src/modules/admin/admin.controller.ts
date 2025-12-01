import { Controller, Get, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('overview')
  async getOverview(@Request() req) {
    this.adminService.ensureIsAdmin(req.user.role);
    return this.adminService.getOverview();
  }

  @Get('users')
  async getUsers(@Request() req) {
    this.adminService.ensureIsAdmin(req.user.role);
    return this.adminService.getUsers();
  }

  @Get('pharmacies')
  async getPharmacies(@Request() req) {
    this.adminService.ensureIsAdmin(req.user.role);
    return this.adminService.getPharmacies();
  }

  @Get('riders')
  async getRiders(@Request() req) {
    this.adminService.ensureIsAdmin(req.user.role);
    return this.adminService.getRiders();
  }

  @Get('orders')
  async getOrders(@Request() req) {
    this.adminService.ensureIsAdmin(req.user.role);
    return this.adminService.getOrders();
  }

  @Get('settings')
  async getSettings(@Request() req) {
    this.adminService.ensureIsAdmin(req.user.role);
    return this.adminService.getSettings();
  }

  @Put('settings')
  async updateSettings(
    @Request() req,
    @Body() body: { defaultDeliveryFeeNear?: number; defaultDeliveryFeeFar?: number; commissionPercentage?: number },
  ) {
    this.adminService.ensureIsAdmin(req.user.role);
    return this.adminService.updateSettings(body);
  }

  @Put('riders/:id/verify')
  async verifyRider(@Request() req, @Param('id') id: string) {
    this.adminService.ensureIsAdmin(req.user.role);
    return this.adminService.verifyRider(id);
  }
}
