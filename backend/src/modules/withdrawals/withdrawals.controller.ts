import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WithdrawalMethod, WithdrawalStatus } from '../../entities';

@Controller('withdrawals')
@UseGuards(JwtAuthGuard)
export class WithdrawalsController {
  constructor(private withdrawalsService: WithdrawalsService) {}

  @Get('earnings/:pharmacyId')
  getEarnings(@Param('pharmacyId') pharmacyId: string) {
    return this.withdrawalsService.getPharmacyEarnings(pharmacyId);
  }

  @Post()
  requestWithdrawal(
    @Body()
    body: {
      pharmacyId: string;
      amount: number;
      method: WithdrawalMethod;
      accountNumber: string;
      accountName?: string;
      bankName?: string;
    },
  ) {
    return this.withdrawalsService.requestWithdrawal(
      body.pharmacyId,
      body.amount,
      body.method,
      body.accountNumber,
      body.accountName,
      body.bankName,
    );
  }

  @Get('pharmacy/:pharmacyId')
  getPharmacyWithdrawals(@Param('pharmacyId') pharmacyId: string) {
    return this.withdrawalsService.getWithdrawals(pharmacyId);
  }

  @Get(':id')
  getWithdrawal(@Param('id') id: string) {
    return this.withdrawalsService.getWithdrawal(id);
  }

  // Admin endpoints
  @Get('admin/pending')
  getPendingWithdrawals() {
    return this.withdrawalsService.getAllPendingWithdrawals();
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body()
    body: {
      status: WithdrawalStatus;
      transactionReference?: string;
      rejectionReason?: string;
    },
  ) {
    return this.withdrawalsService.updateWithdrawalStatus(
      id,
      body.status,
      body.transactionReference,
      body.rejectionReason,
    );
  }
}
