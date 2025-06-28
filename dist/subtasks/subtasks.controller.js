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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtasksController = void 0;
const common_1 = require("@nestjs/common");
const subtasks_service_1 = require("./subtasks.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const subtask_dto_1 = require("./dto/subtask.dto");
let SubtasksController = class SubtasksController {
    constructor(subtasksService) {
        this.subtasksService = subtasksService;
    }
    createSubtask(req, taskId, body) {
        return this.subtasksService.createSubtask(req.user.userId, taskId, body);
    }
    createMultipleSubtasks(req, taskId, body) {
        return this.subtasksService.createMultipleSubtasks(req.user.userId, taskId, body.subtasks);
    }
    updateSubtask(req, id, body) {
        return this.subtasksService.updateSubtask(req.user.userId, id, body);
    }
    deleteSubtask(req, id) {
        return this.subtasksService.deleteSubtask(req.user.userId, id);
    }
};
exports.SubtasksController = SubtasksController;
__decorate([
    (0, common_1.Post)(':taskId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, subtask_dto_1.CreateSubtaskDto]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "createSubtask", null);
__decorate([
    (0, common_1.Post)(':taskId/multiple'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, subtask_dto_1.CreateMultipleSubtasksDto]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "createMultipleSubtasks", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, subtask_dto_1.UpdateSubtaskDto]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "updateSubtask", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "deleteSubtask", null);
exports.SubtasksController = SubtasksController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('subtasks'),
    __metadata("design:paramtypes", [subtasks_service_1.SubtasksService])
], SubtasksController);
//# sourceMappingURL=subtasks.controller.js.map