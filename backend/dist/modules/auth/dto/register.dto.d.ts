import { UserRole } from '../../../entities/user.entity';
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: UserRole;
    pharmacyName?: string;
    pharmacyAddress?: string;
    subdivision?: string;
    vehicleType?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
