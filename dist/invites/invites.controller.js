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
exports.InvitesController = void 0;
const common_1 = require("@nestjs/common");
const invites_service_1 = require("./invites.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const invite_dto_1 = require("./dto/invite.dto");
let InvitesController = class InvitesController {
    constructor(invitesService) {
        this.invitesService = invitesService;
    }
    async createInvite(req, createInviteDto) {
        console.log('📧 Creating invite via controller:', createInviteDto);
        const invite = await this.invitesService.createInvite(createInviteDto.email, createInviteDto.projectId, req.user.userId, createInviteDto.role, createInviteDto.message);
        const { token, ...safeInvite } = invite;
        return {
            ...safeInvite,
            message: 'Invitation sent successfully'
        };
    }
    async getInvite(token) {
        console.log('🔍 Getting invite by token:', token);
        const invite = await this.invitesService.getInviteByToken(token);
        const { id, invitedBy, ...safeInvite } = invite;
        return safeInvite;
    }
    async acceptInvite(token, req) {
        console.log('✅ Accepting invite via controller:', token);
        return await this.invitesService.acceptInvite(token, req.user.userId);
    }
    async declineInvite(token) {
        console.log('❌ Declining invite via controller:', token);
        return await this.invitesService.declineInvite(token);
    }
    async getProjectInvites(projectId, req) {
        console.log('📋 Getting project invites via controller:', projectId);
        return await this.invitesService.getProjectInvites(projectId, req.user.userId);
    }
    async cancelInvite(inviteId, req) {
        console.log('🗑️ Cancelling invite via controller:', inviteId);
        return await this.invitesService.cancelInvite(inviteId, req.user.userId);
    }
    async resendInvite(inviteId, req) {
        console.log('🔄 Resending invite via controller:', inviteId);
        return await this.invitesService.resendInvite(inviteId, req.user.userId);
    }
};
exports.InvitesController = InvitesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, invite_dto_1.CreateInviteDto]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "createInvite", null);
__decorate([
    (0, common_1.Get)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "getInvite", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':token/accept'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "acceptInvite", null);
__decorate([
    (0, common_1.Post)(':token/decline'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "declineInvite", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('project/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "getProjectInvites", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':inviteId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('inviteId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "cancelInvite", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':inviteId/resend'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('inviteId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitesController.prototype, "resendInvite", null);
exports.InvitesController = InvitesController = __decorate([
    (0, common_1.Controller)('invites'),
    __metadata("design:paramtypes", [invites_service_1.InvitesService])
], InvitesController);
//# sourceMappingURL=invites.controller.js.map