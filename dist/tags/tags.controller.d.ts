import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    create(projectId: string, dto: CreateTagDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        projectId: string;
        color: string;
    }>;
    findAll(projectId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        projectId: string;
        color: string;
    }[]>;
    delete(tagId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        projectId: string;
        color: string;
    }>;
}
