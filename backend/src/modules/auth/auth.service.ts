import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, Pharmacy, Rider } from '../../entities';
import { RegisterDto } from './dto/register.dto';
import { Subdivision } from '../../entities/pharmacy.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Pharmacy)
    private pharmaciesRepository: Repository<Pharmacy>,
    @InjectRepository(Rider)
    private ridersRepository: Repository<Rider>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    // Get additional profile data based on role
    let profile: Pharmacy | Rider | null = null;
    if (user.role === UserRole.PHARMACY) {
      profile = await this.pharmaciesRepository.findOne({ where: { userId: user.id } });
    } else if (user.role === UserRole.RIDER) {
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

  async register(registerDto: RegisterDto) {
    const { email, password, name, phone, role, pharmacyName, pharmacyAddress, subdivision, vehicleType } = registerDto;

    // Check if user exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      phone,
      role: role || UserRole.CLIENT,
    });

    const savedUser = await this.usersRepository.save(user);

    // Create role-specific profile
    if (role === UserRole.PHARMACY && pharmacyName && pharmacyAddress && subdivision) {
      const pharmacy = this.pharmaciesRepository.create({
        userId: savedUser.id,
        name: pharmacyName,
        address: pharmacyAddress,
        subdivision: subdivision as Subdivision,
      });
      await this.pharmaciesRepository.save(pharmacy);
    } else if (role === UserRole.RIDER) {
      const rider = this.ridersRepository.create({
        userId: savedUser.id,
        vehicleType: vehicleType || 'motorcycle',
      });
      await this.ridersRepository.save(rider);
    }

    // Return login response
    const { password: _, ...userWithoutPassword } = savedUser;
    return this.login(userWithoutPassword);
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    
    // Get additional profile data based on role
    let profile: Pharmacy | Rider | null = null;
    if (user.role === UserRole.PHARMACY) {
      profile = await this.pharmaciesRepository.findOne({ where: { userId: user.id } });
    } else if (user.role === UserRole.RIDER) {
      profile = await this.ridersRepository.findOne({ where: { userId: user.id } });
    }

    return { user: result, profile };
  }

  async updateProfile(userId: string, updateData: { name?: string; phone?: string; address?: string; subdivision?: string }) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Update user fields
    if (updateData.name) user.name = updateData.name;
    if (updateData.phone !== undefined) user.phone = updateData.phone;
    if (updateData.address !== undefined) user.address = updateData.address;
    if (updateData.subdivision !== undefined) user.subdivision = updateData.subdivision;

    const savedUser = await this.usersRepository.save(user);
    const { password, ...result } = savedUser;

    // Get additional profile data based on role
    let profile: Pharmacy | Rider | null = null;
    if (user.role === UserRole.PHARMACY) {
      profile = await this.pharmaciesRepository.findOne({ where: { userId: user.id } });
    } else if (user.role === UserRole.RIDER) {
      profile = await this.ridersRepository.findOne({ where: { userId: user.id } });
    }

    return { user: result, profile };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  async deleteAccount(userId: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify password before deletion
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect');
    }

    // Delete role-specific profile first
    if (user.role === UserRole.PHARMACY) {
      await this.pharmaciesRepository.delete({ userId: user.id });
    } else if (user.role === UserRole.RIDER) {
      await this.ridersRepository.delete({ userId: user.id });
    }

    // Delete user
    await this.usersRepository.delete({ id: userId });

    return { message: 'Account deleted successfully' };
  }
}
