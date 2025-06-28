// backend/src/auth/auth.controller.ts - Enhanced with invite token support
import { Body, Controller, Post, Query, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: SignupDto,
    @Query('inviteToken') inviteToken?: string
  ) {
    console.log('📝 Signup request:', { 
      email: body.email, 
      name: body.name, 
      hasInviteToken: !!inviteToken 
    });

    return this.authService.signup(
      body.email, 
      body.password, 
      body.name, 
      inviteToken
    );
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Query('inviteToken') inviteToken?: string
  ) {
    console.log('🔑 Login request:', { 
      email: body.email, 
      hasInviteToken: !!inviteToken 
    });

    return this.authService.login(
      body.email, 
      body.password, 
      inviteToken
    );
  }

  @Get('check-invites/:email')
  async checkPendingInvites(@Param('email') email: string) {
    console.log('📧 Checking pending invites for:', email);
    return this.authService.checkPendingInvites(email);
  }
}