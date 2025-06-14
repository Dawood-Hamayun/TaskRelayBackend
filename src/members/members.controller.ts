// backend/src/members/members.controller.ts
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get(':projectId')
  findByProject(@Param('projectId') projectId: string) {
    console.log('🔍 Getting members for project:', projectId);
    return this.membersService.findByProject(projectId);
  }
}