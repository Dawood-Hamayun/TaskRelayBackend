"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const tasks_module_1 = require("./tasks/tasks.module");
const projects_module_1 = require("./projects/projects.module");
const members_module_1 = require("./members/members.module");
const comments_module_1 = require("./comments/comments.module");
const attachments_module_1 = require("./attachments/attachments.module");
const tags_module_1 = require("./tags/tags.module");
const meetings_module_1 = require("./meetings/meetings.module");
const invites_module_1 = require("./invites/invites.module");
const subtasks_service_1 = require("./subtasks/subtasks.service");
const subtasks_controller_1 = require("./subtasks/subtasks.controller");
const subtasks_module_1 = require("./subtasks/subtasks.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, users_module_1.UsersModule, tasks_module_1.TasksModule, projects_module_1.ProjectsModule, members_module_1.MembersModule, comments_module_1.CommentsModule, attachments_module_1.AttachmentsModule, tags_module_1.TagsModule, meetings_module_1.MeetingsModule, invites_module_1.InvitesModule, subtasks_module_1.SubtasksModule],
        providers: [subtasks_service_1.SubtasksService],
        controllers: [subtasks_controller_1.SubtasksController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map