// backend/src/auth/auth.service.ts - Enhanced with invite handling
import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string, name: string, inviteToken?: string) {
    console.log('🔐 Signup attempt:', { email, name, hasInviteToken: !!inviteToken });

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // If there's an invite token, validate it
    let validInvite = null;
    if (inviteToken) {
      validInvite = await this.validateInviteForSignup(email, inviteToken);
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    console.log('✅ User created:', { userId: user.id, email: user.email });

    // If valid invite exists, auto-accept it
    if (validInvite) {
      await this.acceptInviteForNewUser(user.id, validInvite);
      console.log('✅ Auto-accepted invite for new user');
    }

    // Generate access token for immediate login
    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return { 
      access_token,
      message: validInvite 
        ? `Account created and joined ${validInvite.project.name}!`
        : 'Account created successfully!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      autoAcceptedProject: validInvite ? {
        id: validInvite.project.id,
        name: validInvite.project.name
      } : null
    };
  }

  async login(email: string, password: string, inviteToken?: string) {
    console.log('🔐 Login attempt:', { email, hasInviteToken: !!inviteToken });

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    // Generate access token
    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    console.log('✅ Login successful for user:', user.email);

    // If there's an invite token, validate and accept it
    let acceptedInvite = null;
    if (inviteToken) {
      try {
        const validInvite = await this.validateInviteForLogin(email, inviteToken);
        if (validInvite) {
          acceptedInvite = await this.acceptInviteForExistingUser(user.id, validInvite);
          console.log('✅ Auto-accepted invite after login');
        }
      } catch (error) {
        console.warn('⚠️ Could not auto-accept invite:', error.message);
        // Don't fail login if invite acceptance fails
      }
    }

    return { 
      access_token,
      message: acceptedInvite 
        ? `Logged in and joined ${acceptedInvite.project.name}!`
        : 'Login successful!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      autoAcceptedProject: acceptedInvite ? {
        id: acceptedInvite.project.id,
        name: acceptedInvite.project.name
      } : null
    };
  }

  // Validate invite for signup (email must match)
  private async validateInviteForSignup(email: string, token: string) {
    const invite = await this.prisma.invite.findUnique({
      where: { token },
      include: {
        project: { select: { id: true, name: true } },
        inviter: { select: { name: true, email: true } }
      }
    });

    if (!invite) {
      throw new BadRequestException('Invalid invite link');
    }

    if (invite.status !== 'PENDING') {
      throw new BadRequestException('This invite has already been processed');
    }

    if (new Date() > invite.expiresAt) {
      await this.prisma.invite.update({
        where: { id: invite.id },
        data: { status: 'EXPIRED' }
      });
      throw new BadRequestException('This invite has expired');
    }

    if (invite.email !== email) {
      throw new BadRequestException('This invite is for a different email address');
    }

    return invite;
  }

  // Validate invite for login (user must exist and email must match)
  private async validateInviteForLogin(email: string, token: string) {
    const invite = await this.prisma.invite.findUnique({
      where: { token },
      include: {
        project: { select: { id: true, name: true } },
        inviter: { select: { name: true, email: true } }
      }
    });

    if (!invite || invite.status !== 'PENDING' || new Date() > invite.expiresAt) {
      return null; // Don't throw error for login, just skip invite acceptance
    }

    if (invite.email !== email) {
      return null; // Wrong email, skip invite acceptance
    }

    // Check if user is already a member
    const existingMember = await this.prisma.member.findFirst({
      where: {
        user: { email },
        projectId: invite.projectId
      }
    });

    if (existingMember) {
      // Mark invite as accepted and return null
      await this.prisma.invite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED' }
      });
      return null;
    }

    return invite;
  }

  // Accept invite for new user
  private async acceptInviteForNewUser(userId: string, invite: any) {
    return this.prisma.$transaction(async (tx) => {
      // Create member
      const member = await tx.member.create({
        data: {
          userId,
          projectId: invite.projectId,
          role: invite.role
        },
        include: {
          project: { select: { id: true, name: true } },
          user: { select: { id: true, name: true, email: true } }
        }
      });

      // Mark invite as accepted
      await tx.invite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED' }
      });

      return member;
    });
  }

  // Accept invite for existing user
  private async acceptInviteForExistingUser(userId: string, invite: any) {
    return this.prisma.$transaction(async (tx) => {
      // Create member
      const member = await tx.member.create({
        data: {
          userId,
          projectId: invite.projectId,
          role: invite.role
        },
        include: {
          project: { select: { id: true, name: true } },
          user: { select: { id: true, name: true, email: true } }
        }
      });

      // Mark invite as accepted
      await tx.invite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED' }
      });

      return member;
    });
  }

  // Helper method to check if email has pending invites
  async checkPendingInvites(email: string) {
    const invites = await this.prisma.invite.findMany({
      where: {
        email,
        status: 'PENDING',
        expiresAt: { gt: new Date() }
      },
      include: {
        project: { select: { id: true, name: true, description: true } },
        inviter: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return invites;
  }
}