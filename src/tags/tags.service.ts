// backend/src/tags/tags.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(projectId: string, dto: CreateTagDto) {
    return this.prisma.tag.create({
      data: {
        ...dto,
        projectId,
      },
    });
  }

  async findAll(projectId: string) {
    return this.prisma.tag.findMany({
      where: { projectId },
      orderBy: { name: 'asc' }
    });
  }

  async update(tagId: string, dto: Partial<CreateTagDto>) {
    return this.prisma.tag.update({
      where: { id: tagId },
      data: dto
    });
  }

  async delete(tagId: string) {
    // First remove tag associations
    await this.prisma.taskTag.deleteMany({
      where: { tagId }
    });

    return this.prisma.tag.delete({
      where: { id: tagId }
    });
  }
}