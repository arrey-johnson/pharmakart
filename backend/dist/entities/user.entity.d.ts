export declare enum UserRole {
    ADMIN = "ADMIN",
    PHARMACY = "PHARMACY",
    CLIENT = "CLIENT",
    RIDER = "RIDER"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
    subdivision: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
