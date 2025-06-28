// backend/src/members/members.controller.ts - Fixed with proper imports and error handling
import { 
  Controller, 
  Put, 
  Delete,
  Body, 
  Param, 
  Query,
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { MembersService } from './members.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';

interface UpdateMemberRoleDto {
  role: Role;
  projectId: string;
}

@UseGuards(JwtAuthGuard)
@Controller('members')
export class MembersController {
  private readonly logger = new Logger(MembersController.name);

  constructor(private readonly membersService: MembersService) {
    this.logger.log('MembersController initialized');
  }

  @Put(':memberId/role')
  async updateMemberRole(
    @Param('memberId') memberId: string,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
    @Request() req
  ) {
    this.logger.log(`PUT /members/${memberId}/role called`);
    this.logger.log('Request data:', { 
      memberId, 
      role: updateMemberRoleDto.role,
      projectId: updateMemberRoleDto.projectId,
      userId: req.user?.userId 
    });

    if (!updateMemberRoleDto.projectId) {
      throw new BadRequestException('Project ID is required');
    }

    if (!updateMemberRoleDto.role) {
      throw new BadRequestException('Role is required');
    }

    try {
      const result = await this.membersService.updateMemberRole(
        updateMemberRoleDto.projectId,
        memberId,
        updateMemberRoleDto.role,
        req.user.userId
      );
      
      this.logger.log('Member role updated successfully');
      return result;
    } catch (error) {
      this.logger.error('Failed to update member role:', error.message);
      throw error;
    }
  }

  @Delete(':memberId')
  @HttpCode(HttpStatus.OK)
  async removeMember(
    @Param('memberId') memberId: string,
    @Query('projectId') projectId: string,
    @Request() req
  ) {
    this.logger.log(`DELETE /members/${memberId} called`);
    this.logger.log('Request data:', { 
      memberId, 
      projectId,
      userId: req.user?.userId 
    });

    if (!projectId) {
      throw new BadRequestException('Project ID is required as query parameter');
    }

    try {
      const result = await this.membersService.removeMember(
        projectId,
        memberId,
        req.user.userId
      );
      
      this.logger.log('Member removed successfully');
      return result;
    } catch (error) {
      this.logger.error('Failed to remove member:', error.message);
      throw error;
    }
  }
}