import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { MedicinesService } from './medicines.service';

@Controller('medicines')
export class MedicinesController {
  constructor(private medicinesService: MedicinesService) {}

  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.medicinesService.findAll(categoryId);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.medicinesService.search(query || '');
  }

  @Get('available')
  searchAvailable(
    @Query('q') query?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.medicinesService.searchAvailable(query, categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicinesService.findOne(id);
  }

  @Get(':id/offers')
  getPharmacyOffers(@Param('id') id: string) {
    return this.medicinesService.getPharmacyOffers(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.medicinesService.create(body);
  }

  @Post('seed')
  seed() {
    return this.medicinesService.seed();
  }
}
