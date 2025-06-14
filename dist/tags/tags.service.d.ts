import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
export declare class TagsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(projectId: string, dto: CreateTagDto): Promise<{
        id: string;
        projectId: string;
        name: string;
        color: string;
    }>;
    findAll(projectId: string): Promise<{
        id: string;
        projectId: string;
        name: string;
        color: string;
    }[]>;
    update(tagId: string, dto: Partial<CreateTagDto>): Promise<{
        id: string;
        projectId: string;
        name: string;
        color: string;
    }>;
    delete(tagId: string): Promise<{
        id: string;
        projectId: string;
        name: string;
        color: string;
    }>;
}
