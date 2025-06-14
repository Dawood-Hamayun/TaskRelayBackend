import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // Create project and make user owner automatically
  async createProject(userId: string, name: string) {
    console.log('Creating project with userId:', userId, 'name:', name);
    
    try {
      const project = await this.prisma.project.create({
        data: {
          name,
          members: {
            create: {
              userId: userId, // Use userId directly
              role: 'OWNER'
            }
          }
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true
                }
              }
            }
          }
        }
      });

      console.log('Project created successfully:', project);
      return project;
    } catch (error) {
      console.error('Database error creating project:', error);
      throw error;
    }
  }

  // Get all projects user belongs to
  async getUserProjects(userId: string) {
    console.log('Getting projects for userId:', userId);
    
    try {
      const projects = await this.prisma.project.findMany({
        where: {
          members: {
            some: { userId }
          }
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true
                }
              }
            }
          },
          _count: {
            select: {
              tasks: true,
              members: true
            }
          }
        }
      });

      console.log('Found projects:', projects);
      return projects;
    } catch (error) {
      console.error('Database error getting projects:', error);
      throw error;
    }
  }
}