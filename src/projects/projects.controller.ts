// backend/src/projects/projects.controller.ts - Enhanced
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getProjects(@Request() req) {
    return await this.projectsService.getUserProjects(req.user.userId);
  }

  @Get(':id')
  async getProject(@Param('id') id: string, @Request() req) {
    return await this.projectsService.getProjectById(id, req.user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProject(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return await this.projectsService.createProject(
      req.user.userId, 
      createProjectDto.name,
      createProjectDto.description
    );
  }

  @Put(':id')
  async updateProject(
    @Param('id') id: string,
    @Request() req,
    @Body() updateProjectDto: UpdateProjectDto
  ) {
    return await this.projectsService.updateProject(id, req.user.userId, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProject(@Param('id') id: string, @Request() req) {
    return await this.projectsService.deleteProject(id, req.user.userId);
  }
}