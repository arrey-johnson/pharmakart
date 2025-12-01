import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../../entities/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  // Pharmacy fields
  @IsString()
  @IsOptional()
  pharmacyName?: string;

  @IsString()
  @IsOptional()
  pharmacyAddress?: string;

  @IsString()
  @IsOptional()
  subdivision?: string;

  // Rider fields
  @IsString()
  @IsOptional()
  vehicleType?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
