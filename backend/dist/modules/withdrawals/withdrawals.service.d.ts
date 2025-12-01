import { Repository } from 'typeorm';
import { Withdrawal, WithdrawalStatus, WithdrawalMethod, Order } from '../../entities';
export declare class WithdrawalsService {
    private withdrawalsRepository;
    private ordersRepository;
    constructor(withdrawalsRepository: Repository<Withdrawal>, ordersRepository: Repository<Order>);
    getPharmacyEarnings(pharmacyId: string): Promise<{
        totalEarnings: number;
        totalWithdrawn: number;
        pendingAmount: number;
        availableBalance: number;
        totalOrders: number;
    }>;
    requestWithdrawal(pharmacyId: string, amount: number, method: WithdrawalMethod, accountNumber: string, accountName?: string, bankName?: string): Promise<Withdrawal>;
    getWithdrawals(pharmacyId: string): Promise<Withdrawal[]>;
    getWithdrawal(id: string): Promise<Withdrawal | null>;
    updateWithdrawalStatus(id: string, status: WithdrawalStatus, transactionReference?: string, rejectionReason?: string): Promise<Withdrawal>;
    getAllPendingWithdrawals(): Promise<Withdrawal[]>;
}
