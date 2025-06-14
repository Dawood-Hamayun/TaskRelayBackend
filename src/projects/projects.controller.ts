import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getProjects(@Request() req) {
    console.log('Getting projects for user:', req.user);
    try {
      return await this.projectsService.getUserProjects(req.user.userId);
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  }

  @Post()
  async createProject(@Request() req, @Body() body: CreateProjectDto) {
    console.log('Create Project Request:', {
      body,
      user: req.user,
      userId: req.user?.userId
    });
    
    try {
      const project = await this.projectsService.createProject(req.user.userId, body.name);
      console.log('Project created successfully:', project);
      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
}