import { User } from './user.entity';
export declare enum Subdivision {
    DOUALA_I = "DOUALA_I",
    DOUALA_II = "DOUALA_II",
    DOUALA_III = "DOUALA_III",
    DOUALA_IV = "DOUALA_IV",
    DOUALA_V = "DOUALA_V"
}
export declare class Pharmacy {
    id: string;
    userId: string;
    user: User;
    name: string;
    logoUrl: string;
    address: string;
    subdivision: Subdivision;
    latitude: number;
    longitude: number;
    openingHours: string;
    isVerified: boolean;
    rating: number;
    totalReviews: number;
    createdAt: Date;
    updatedAt: Date;
}
