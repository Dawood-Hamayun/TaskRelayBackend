"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let TasksGateway = class TasksGateway {
    emitTaskCreated(task) {
        this.server.emit('taskCreated', task);
    }
    emitTaskUpdated(task) {
        this.server.emit('taskUpdated', task);
    }
    emitTaskDeleted(taskId) {
        this.server.emit('taskDeleted', { taskId });
    }
    emitToProject(projectId, event, data) {
        this.server.to(`project:${projectId}`).emit(event, data);
    }
    emitProjectTaskCreated(projectId, task) {
        this.server.to(`project:${projectId}`).emit('taskCreated', task);
    }
    emitProjectTaskUpdated(projectId, task) {
        this.server.to(`project:${projectId}`).emit('taskUpdated', task);
    }
    emitProjectTaskDeleted(projectId, taskId) {
        this.server.to(`project:${projectId}`).emit('taskDeleted', { taskId });
    }
};
exports.TasksGateway = TasksGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TasksGateway.prototype, "server", void 0);
exports.TasksGateway = TasksGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3001',
            credentials: true
        }
    })
], TasksGateway);
//# sourceMappingURL=tasks.gateway.js.map