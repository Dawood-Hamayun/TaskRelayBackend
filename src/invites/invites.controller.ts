// backend/src/invites/invites.controller.ts - Fixed with resend endpoint
import { 
  Controller, 
  Get, 
  Post, 
  Delete,
  Body, 
  Param, 
  UseGuards, 
  Request,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { InvitesService } from './invites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateInviteDto } from './dto/invite.dto';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createInvite(@Request() req, @Body() createInviteDto: CreateInviteDto) {
    console.log('📧 Creating invite via controller:', createInviteDto);
    
    const invite = await this.invitesService.createInvite(
      createInviteDto.email,
      createInviteDto.projectId,
      req.user.userId,
      createInviteDto.role,
      createInviteDto.message
    );
    
    // Don't expose sensitive data
    const { token, ...safeInvite } = invite;
    return {
      ...safeInvite,
      message: 'Invitation sent successfully'
    };
  }

  // ✅ PUBLIC ROUTE - No auth required to view invite
  @Get(':token')
  async getInvite(@Param('token') token: string) {
    console.log('🔍 Getting invite by token:', token);
    
    const invite = await this.invitesService.getInviteByToken(token);
    // Don't expose internal IDs and sensitive data
    const { id, invitedBy, ...safeInvite } = invite;
    return safeInvite;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':token/accept')
  async acceptInvite(@Param('token') token: string, @Request() req) {
    console.log('✅ Accepting invite via controller:', token);
    return await this.invitesService.acceptInvite(token, req.user.userId);
  }

  // ✅ PUBLIC ROUTE - No auth required to decline
  @Post(':token/decline')
  @HttpCode(HttpStatus.OK)
  async declineInvite(@Param('token') token: string) {
    console.log('❌ Declining invite via controller:', token);
    return await this.invitesService.declineInvite(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('project/:projectId')
  async getProjectInvites(@Param('projectId') projectId: string, @Request() req) {
    console.log('📋 Getting project invites via controller:', projectId);
    return await this.invitesService.getProjectInvites(projectId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':inviteId')
  @HttpCode(HttpStatus.OK)
  async cancelInvite(@Param('inviteId') inviteId: string, @Request() req) {
    console.log('🗑️ Cancelling invite via controller:', inviteId);
    return await this.invitesService.cancelInvite(inviteId, req.user.userId);
  }

  // ✅ FIXED: Added resend endpoint
  @UseGuards(JwtAuthGuard)
  @Post(':inviteId/resend')
  @HttpCode(HttpStatus.OK)
  async resendInvite(@Param('inviteId') inviteId: string, @Request() req) {
    console.log('🔄 Resending invite via controller:', inviteId);
    return await this.invitesService.resendInvite(inviteId, req.user.userId);
  }
}