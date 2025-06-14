import { Controller, Post, Body, Param, UseGuards, Request, Get } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post('create/:projectId')
  createInvite(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() body: { email: string; role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER' }
  ) {
    return this.invitesService.createInvite(body.email, projectId, body.role);
  }

  @Post('accept')
  acceptInvite(
    @Request() req
  ) {
    return this.invitesService.acceptInvite(req.user.email, req.user.userId);
  }

  @Get(':projectId')
  getInvites(@Param('projectId') projectId: string) {
    return this.invitesService.getProjectInvites(projectId);
  }
}