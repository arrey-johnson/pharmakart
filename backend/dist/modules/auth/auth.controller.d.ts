import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
        profile: import("../../entities").Pharmacy | import("../../entities").Rider | null;
    }>;
    login(req: any): Promise<{
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
        profile: import("../../entities").Pharmacy | import("../../entities").Rider | null;
    }>;
    getProfile(req: any): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            phone: string;
            address: string;
            subdivision: string;
            role: import("../../entities").UserRole;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        profile: import("../../entities").Pharmacy | import("../../entities").Rider | null;
    }>;
    updateProfile(req: any, updateData: {
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
            role: import("../../entities").UserRole;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        profile: import("../../entities").Pharmacy | import("../../entities").Rider | null;
    }>;
    changePassword(req: any, data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    deleteAccount(req: any, data: {
        password: string;
    }): Promise<{
        message: string;
    }>;
}
