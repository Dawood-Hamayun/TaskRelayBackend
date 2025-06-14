import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
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
}
export declare class TagsModule {
}
