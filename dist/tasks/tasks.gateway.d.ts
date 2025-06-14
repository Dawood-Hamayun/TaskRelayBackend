import { Server } from 'socket.io';
export declare class TasksGateway {
    server: Server;
    emitTaskCreated(task: any): void;
    emitTaskUpdated(task: any): void;
    emitTaskDeleted(taskId: string): void;
    emitToProject(projectId: string, event: string, data: any): void;
    emitProjectTaskCreated(projectId: string, task: any): void;
    emitProjectTaskUpdated(projectId: string, task: any): void;
    emitProjectTaskDeleted(projectId: string, taskId: string): void;
}
