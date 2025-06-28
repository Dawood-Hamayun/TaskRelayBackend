import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    getProjects(req: any): Promise<{
        id: any;
        name: any;
        description: any;
        members: any;
        tasks: {
            total: number;
            completed: number;
            inProgress: number;
            overdue: number;
            todo: number;
        };
        meetings: any;
        tags: any;
        createdAt: any;
        lastActivity: any;
        status: "completed" | "active" | "archived";
        _count: any;
    }[]>;
    getProject(id: string, req: any): Promise<{
        id: any;
        name: any;
        description: any;
        members: any;
        tasks: {
            total: number;
            completed: number;
            inProgress: number;
            overdue: number;
            todo: number;
        };
        meetings: any;
        tags: any;
        createdAt: any;
        lastActivity: any;
        status: "completed" | "active" | "archived";
        _count: any;
    }>;
    createProject(req: any, createProjectDto: CreateProjectDto): Promise<{
        id: any;
        name: any;
        description: any;
        members: any;
        tasks: {
            total: number;
            completed: number;
            inProgress: number;
            overdue: number;
            todo: number;
        };
        meetings: any;
        tags: any;
        createdAt: any;
        lastActivity: any;
        status: "completed" | "active" | "archived";
        _count: any;
    }>;
    updateProject(id: string, req: any, updateProjectDto: UpdateProjectDto): Promise<{
        id: any;
        name: any;
        description: any;
        members: any;
        tasks: {
            total: number;
            completed: number;
            inProgress: number;
            overdue: number;
            todo: number;
        };
        meetings: any;
        tags: any;
        createdAt: any;
        lastActivity: any;
        status: "completed" | "active" | "archived";
        _count: any;
    }>;
    deleteProject(id: string, req: any): Promise<{
        message: string;
    }>;
}
