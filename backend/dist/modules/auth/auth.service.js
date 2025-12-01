"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const entities_1 = require("../../entities");
let AuthService = class AuthService {
    usersRepository;
    pharmaciesRepository;
    ridersRepository;
    jwtService;
    constructor(usersRepository, pharmaciesRepository, ridersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.pharmaciesRepository = pharmaciesRepository;
        this.ridersRepository = ridersRepository;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        let profile = null;
        if (user.role === entities_1.UserRole.PHARMACY) {
            profile = await this.pharmaciesRepository.findOne({ where: { userId: user.id } });
        }
        else if (user.role === entities_1.UserRole.RIDER) {
            profile = await this.ridersRepository.findOne({ where: { userId: user.id } });
        }
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                address: user.address,
                subdivision: user.subdivision,
                role: user.role,
            },
            profile,
        };
    }
    async register(registerDto) {
        const { email, password, name, phone, role, pharmacyName, pharmacyAddress, subdivision, vehicleType } = registerDto;
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            email,
            password: hashedPassword,
            name,
            phone,
            role: role || entities_1.UserRole.CLIENT,
        });
        const savedUser = await this.usersRepository.save(user);
        if (role === entities_1.UserRole.PHARMACY && pharmacyName && pharmacyAddress && subdivision) {
            const pharmacy = this.pharmaciesRepository.create({
                userId: savedUser.id,
                name: pharmacyName,
                address: pharmacyAddress,
                subdivision: subdivision,
            });
            await this.pharmaciesRepository.save(pharmacy);
        }
        else if (role === entities_1.UserRole.RIDER) {
            const rider = this.ridersRepository.create({
                userId: savedUser.id,
                vehicleType: vehicleType || 'motorcycle',
            });
            await this.ridersRepository.save(rider);
        }
        const { password: _, ...userWithoutPassword } = savedUser;
        return this.login(userWithoutPassword);
    }
    async getProfile(userId) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const { password, ...result } = user;
        let profile = null;
        if (user.role === entities_1.UserRole.PHARMACY) {
            profile = await this.pharmaciesRepository.findOne({ where: { userId: user.id } });
        }
        else if (user.role === entities_1.UserRole.RIDER) {
            profile = await this.ridersRepository.findOne({ where: { userId: user.id } });
        }
        return { user: result, profile };
    }
    async updateProfile(userId, updateData) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (updateData.name)
            user.name = updateData.name;
        if (updateData.phone !== undefined)
            user.phone = updateData.phone;
        if (updateData.address !== undefined)
            user.address = updateData.address;
        if (updateData.subdivision !== undefined)
            user.subdivision = updateData.subdivision;
        const savedUser = await this.usersRepository.save(user);
        const { password, ...result } = savedUser;
        let profile = null;
        if (user.role === entities_1.UserRole.PHARMACY) {
            profile = await this.pharmaciesRepository.findOne({ where: { userId: user.id } });
        }
        else if (user.role === entities_1.UserRole.RIDER) {
            profile = await this.ridersRepository.findOne({ where: { userId: user.id } });
        }
        return { user: result, profile };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await this.usersRepository.save(user);
        return { message: 'Password changed successfully' };
    }
    async deleteAccount(userId, password) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Password is incorrect');
        }
        if (user.role === entities_1.UserRole.PHARMACY) {
            await this.pharmaciesRepository.delete({ userId: user.id });
        }
        else if (user.role === entities_1.UserRole.RIDER) {
            await this.ridersRepository.delete({ userId: user.id });
        }
        await this.usersRepository.delete({ id: userId });
        return { message: 'Account deleted successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Pharmacy)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Rider)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map