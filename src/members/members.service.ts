// backend/src/members/members.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async findByProject(projectId: string) {
    console.log('📊 MembersService - Finding members for project:', projectId);
    
    try {
      const members = await this.prisma.member.findMany({
        where: { projectId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      });

      console.log('✅ Found members:', members);
      return members;
    } catch (error) {
      console.error('❌ Error finding members:', error);
      throw error;
    }
  }

  async findUserProjects(userId: string) {
    return this.prisma.member.findMany({
      where: { userId },
      include: {
        project: true
      }
    });
  }
}
