import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Withdrawal, WithdrawalStatus, WithdrawalMethod, Order, OrderStatus } from '../../entities';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(Withdrawal)
    private withdrawalsRepository: Repository<Withdrawal>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async getPharmacyEarnings(pharmacyId: string) {
    // Calculate total earnings from delivered orders
    const deliveredOrders = await this.ordersRepository.find({
      where: {
        pharmacyId,
        status: OrderStatus.DELIVERED,
      },
    });

    const totalEarnings = deliveredOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );

    // Calculate total withdrawn (completed withdrawals)
    const completedWithdrawals = await this.withdrawalsRepository.find({
      where: {
        pharmacyId,
        status: WithdrawalStatus.COMPLETED,
      },
    });

    const totalWithdrawn = completedWithdrawals.reduce(
      (sum, w) => sum + Number(w.amount),
      0,
    );

    // Calculate pending withdrawals
    const pendingWithdrawals = await this.withdrawalsRepository.find({
      where: [
        { pharmacyId, status: WithdrawalStatus.PENDING },
        { pharmacyId, status: WithdrawalStatus.PROCESSING },
      ],
    });

    const pendingAmount = pendingWithdrawals.reduce(
      (sum, w) => sum + Number(w.amount),
      0,
    );

    const availableBalance = totalEarnings - totalWithdrawn - pendingAmount;

    return {
      totalEarnings,
      totalWithdrawn,
      pendingAmount,
      availableBalance,
      totalOrders: deliveredOrders.length,
    };
  }

  async requestWithdrawal(
    pharmacyId: string,
    amount: number,
    method: WithdrawalMethod,
    accountNumber: string,
    accountName?: string,
    bankName?: string,
  ) {
    // Check available balance
    const earnings = await this.getPharmacyEarnings(pharmacyId);
    
    if (amount <= 0) {
      throw new BadRequestException('Withdrawal amount must be greater than 0');
    }

    if (amount > earnings.availableBalance) {
      throw new BadRequestException(
        `Insufficient balance. Available: ${earnings.availableBalance} XAF`,
      );
    }

    // Minimum withdrawal amount
    const minWithdrawal = 1000;
    if (amount < minWithdrawal) {
      throw new BadRequestException(
        `Minimum withdrawal amount is ${minWithdrawal} XAF`,
      );
    }

    const withdrawal = this.withdrawalsRepository.create({
      pharmacyId,
      amount,
      method,
      accountNumber,
      accountName,
      bankName,
      status: WithdrawalStatus.PENDING,
    });

    return this.withdrawalsRepository.save(withdrawal);
  }

  async getWithdrawals(pharmacyId: string) {
    return this.withdrawalsRepository.find({
      where: { pharmacyId },
      order: { createdAt: 'DESC' },
    });
  }

  async getWithdrawal(id: string) {
    return this.withdrawalsRepository.findOne({
      where: { id },
      relations: ['pharmacy'],
    });
  }

  // Admin functions
  async updateWithdrawalStatus(
    id: string,
    status: WithdrawalStatus,
    transactionReference?: string,
    rejectionReason?: string,
  ) {
    const withdrawal = await this.withdrawalsRepository.findOne({
      where: { id },
    });

    if (!withdrawal) {
      throw new BadRequestException('Withdrawal not found');
    }

    withdrawal.status = status;
    
    if (status === WithdrawalStatus.COMPLETED) {
      withdrawal.processedAt = new Date();
      if (transactionReference) {
        withdrawal.transactionReference = transactionReference;
      }
    }
    
    if (status === WithdrawalStatus.REJECTED && rejectionReason) {
      withdrawal.rejectionReason = rejectionReason;
    }

    return this.withdrawalsRepository.save(withdrawal);
  }

  async getAllPendingWithdrawals() {
    return this.withdrawalsRepository.find({
      where: [
        { status: WithdrawalStatus.PENDING },
        { status: WithdrawalStatus.PROCESSING },
      ],
      relations: ['pharmacy'],
      order: { createdAt: 'ASC' },
    });
  }
}
