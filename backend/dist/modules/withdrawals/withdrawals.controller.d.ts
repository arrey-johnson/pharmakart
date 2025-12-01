import { WithdrawalsService } from './withdrawals.service';
import { WithdrawalMethod, WithdrawalStatus } from '../../entities';
export declare class WithdrawalsController {
    private withdrawalsService;
    constructor(withdrawalsService: WithdrawalsService);
    getEarnings(pharmacyId: string): Promise<{
        totalEarnings: number;
        totalWithdrawn: number;
        pendingAmount: number;
        availableBalance: number;
        totalOrders: number;
    }>;
    requestWithdrawal(body: {
        pharmacyId: string;
        amount: number;
        method: WithdrawalMethod;
        accountNumber: string;
        accountName?: string;
        bankName?: string;
    }): Promise<import("../../entities").Withdrawal>;
    getPharmacyWithdrawals(pharmacyId: string): Promise<import("../../entities").Withdrawal[]>;
    getWithdrawal(id: string): Promise<import("../../entities").Withdrawal | null>;
    getPendingWithdrawals(): Promise<import("../../entities").Withdrawal[]>;
    updateStatus(id: string, body: {
        status: WithdrawalStatus;
        transactionReference?: string;
        rejectionReason?: string;
    }): Promise<import("../../entities").Withdrawal>;
}
