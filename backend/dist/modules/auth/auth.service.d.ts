import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserRole, Pharmacy, Rider } from '../../entities';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersRepository;
    private pharmaciesRepository;
    private ridersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, pharmaciesRepository: Repository<Pharmacy>, ridersRepository: Repository<Rider>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            phone: any;
            address: any;
            subdivision: any;
            role: any;
        };
        profile: Pharmacy | Rider | null;
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            phone: any;
            address: any;
            subdivision: any;
            role: any;
        };
        profile: Pharmacy | Rider | null;
    }>;
    getProfile(userId: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            phone: string;
            address: string;
            subdivision: string;
            role: UserRole;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        profile: Pharmacy | Rider | null;
    }>;
    updateProfile(userId: string, updateData: {
        name?: string;
        phone?: string;
        address?: string;
        subdivision?: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            phone: string;
            address: string;
            subdivision: string;
            role: UserRole;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        profile: Pharmacy | Rider | null;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    deleteAccount(userId: string, password: string): Promise<{
        message: string;
    }>;
}
