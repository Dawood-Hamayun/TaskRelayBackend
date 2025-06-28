// backend/src/tags/tags.controller.ts
import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post(':projectId')
  create(@Param('projectId') projectId: string, @Body() dto: CreateTagDto) {
    return this.tagsService.create(projectId, dto);
  }

  @Get(':projectId')
  findAll(@Param('projectId') projectId: string) {
    return this.tagsService.findAll(projectId);
  }

  @Delete(':tagId')
  delete(@Param('tagId') tagId: string) {
    return this.tagsService.delete(tagId);
  }
}