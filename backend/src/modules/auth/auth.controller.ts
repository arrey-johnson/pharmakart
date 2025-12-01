import { Controller, Post, Body, UseGuards, Request, Get, Put, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateData: { name?: string; phone?: string; address?: string; subdivision?: string }
  ) {
    return this.authService.updateProfile(req.user.userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body() data: { currentPassword: string; newPassword: string }
  ) {
    return this.authService.changePassword(req.user.userId, data.currentPassword, data.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('account')
  async deleteAccount(
    @Request() req,
    @Body() data: { password: string }
  ) {
    return this.authService.deleteAccount(req.user.userId, data.password);
  }
}
