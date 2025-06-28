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
exports.MeetingsController = void 0;
const common_1 = require("@nestjs/common");
const meetings_service_1 = require("./meetings.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const meeting_dto_1 = require("./dto/meeting.dto");
let MeetingsController = class MeetingsController {
    constructor(meetingsService) {
        this.meetingsService = meetingsService;
    }
    async createMeeting(projectId, createMeetingDto, req) {
        return await this.meetingsService.createMeeting(req.user.userId, projectId, createMeetingDto);
    }
    async getUserMeetings(req, startDate, endDate) {
        return await this.meetingsService.getUserMeetings(req.user.userId, startDate, endDate);
    }
    async getProjectMeetings(projectId, req, startDate, endDate) {
        return await this.meetingsService.getProjectMeetings(req.user.userId, projectId, startDate, endDate);
    }
    async updateMeeting(meetingId, updateMeetingDto, req) {
        return await this.meetingsService.updateMeeting(req.user.userId, meetingId, updateMeetingDto);
    }
    async deleteMeeting(meetingId, req) {
        return await this.meetingsService.deleteMeeting(req.user.userId, meetingId);
    }
    async respondToMeeting(meetingId, body, req) {
        return await this.meetingsService.updateAttendeeStatus(req.user.userId, meetingId, body.status);
    }
};
exports.MeetingsController = MeetingsController;
__decorate([
    (0, common_1.Post)(':projectId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, meeting_dto_1.CreateMeetingDto, Object]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "createMeeting", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "getUserMeetings", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "getProjectMeetings", null);
__decorate([
    (0, common_1.Put)(':meetingId'),
    __param(0, (0, common_1.Param)('meetingId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, meeting_dto_1.UpdateMeetingDto, Object]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "updateMeeting", null);
__decorate([
    (0, common_1.Delete)(':meetingId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('meetingId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "deleteMeeting", null);
__decorate([
    (0, common_1.Put)(':meetingId/response'),
    __param(0, (0, common_1.Param)('meetingId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MeetingsController.prototype, "respondToMeeting", null);
exports.MeetingsController = MeetingsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('meetings'),
    __metadata("design:paramtypes", [meetings_service_1.MeetingsService])
], MeetingsController);
//# sourceMappingURL=meetings.controller.js.map