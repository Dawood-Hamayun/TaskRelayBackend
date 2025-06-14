// tasks/tasks.gateway.ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ 
  cors: { 
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true 
  } 
})
export class TasksGateway {
  @WebSocketServer()
  server: Server;

  emitTaskCreated(task: any) {
    this.server.emit('taskCreated', task);
  }

  emitTaskUpdated(task: any) {
    this.server.emit('taskUpdated', task);
  }

  emitTaskDeleted(taskId: string) {
    this.server.emit('taskDeleted', { taskId });
  }

  // Emit to specific project room
  emitToProject(projectId: string, event: string, data: any) {
    this.server.to(`project:${projectId}`).emit(event, data);
  }

  emitProjectTaskCreated(projectId: string, task: any) {
    this.server.to(`project:${projectId}`).emit('taskCreated', task);
  }

  emitProjectTaskUpdated(projectId: string, task: any) {
    this.server.to(`project:${projectId}`).emit('taskUpdated', task);
  }

  emitProjectTaskDeleted(projectId: string, taskId: string) {
    this.server.to(`project:${projectId}`).emit('taskDeleted', { taskId });
  }
}