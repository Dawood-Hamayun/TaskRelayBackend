import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    getProjects(req: any): Promise<({
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            projectId: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            userId: string;
        })[];
        _count: {
            members: number;
            tasks: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
    })[]>;
    createProject(req: any, body: CreateProjectDto): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            projectId: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            userId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
    }>;
}
