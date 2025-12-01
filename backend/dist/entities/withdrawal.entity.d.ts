import { Pharmacy } from './pharmacy.entity';
export declare enum WithdrawalStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED"
}
export declare enum WithdrawalMethod {
    MTN_MOMO = "MTN_MOMO",
    ORANGE_MONEY = "ORANGE_MONEY",
    BANK_TRANSFER = "BANK_TRANSFER"
}
export declare class Withdrawal {
    id: string;
    pharmacyId: string;
    pharmacy: Pharmacy;
    amount: number;
    method: WithdrawalMethod;
    accountNumber: string;
    accountName: string;
    bankName: string;
    status: WithdrawalStatus;
    rejectionReason: string;
    transactionReference: string;
    processedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
