import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';

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
}