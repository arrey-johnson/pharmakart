import { User } from './user.entity';
export declare enum RiderStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare class Rider {
    id: string;
    userId: string;
    user: User;
    status: RiderStatus;
    vehicleType: string;
    licenseNumber: string;
    currentLatitude: number;
    currentLongitude: number;
    totalDeliveries: number;
    rating: number;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
