import { TaskPriority, TaskStatus } from './create-task.dto';
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: string;
    assigneeId?: string;
    tags?: string[];
}
