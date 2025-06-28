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
var MembersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersController = void 0;
const common_1 = require("@nestjs/common");
const members_service_1 = require("./members.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let MembersController = MembersController_1 = class MembersController {
    constructor(membersService) {
        this.membersService = membersService;
        this.logger = new common_1.Logger(MembersController_1.name);
        this.logger.log('MembersController initialized');
    }
    async updateMemberRole(memberId, updateMemberRoleDto, req) {
        this.logger.log(`PUT /members/${memberId}/role called`);
        this.logger.log('Request data:', {
            memberId,
            role: updateMemberRoleDto.role,
            projectId: updateMemberRoleDto.projectId,
            userId: req.user?.userId
        });
        if (!updateMemberRoleDto.projectId) {
            throw new common_1.BadRequestException('Project ID is required');
        }
        if (!updateMemberRoleDto.role) {
            throw new common_1.BadRequestException('Role is required');
        }
        try {
            const result = await this.membersService.updateMemberRole(updateMemberRoleDto.projectId, memberId, updateMemberRoleDto.role, req.user.userId);
            this.logger.log('Member role updated successfully');
            return result;
        }
        catch (error) {
            this.logger.error('Failed to update member role:', error.message);
            throw error;
        }
    }
    async removeMember(memberId, projectId, req) {
        this.logger.log(`DELETE /members/${memberId} called`);
        this.logger.log('Request data:', {
            memberId,
            projectId,
            userId: req.user?.userId
        });
        if (!projectId) {
            throw new common_1.BadRequestException('Project ID is required as query parameter');
        }
        try {
            const result = await this.membersService.removeMember(projectId, memberId, req.user.userId);
            this.logger.log('Member removed successfully');
            return result;
        }
        catch (error) {
            this.logger.error('Failed to remove member:', error.message);
            throw error;
        }
    }
};
exports.MembersController = MembersController;
__decorate([
    (0, common_1.Put)(':memberId/role'),
    __param(0, (0, common_1.Param)('memberId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "updateMemberRole", null);
__decorate([
    (0, common_1.Delete)(':memberId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('memberId')),
    __param(1, (0, common_1.Query)('projectId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "removeMember", null);
exports.MembersController = MembersController = MembersController_1 = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('members'),
    __metadata("design:paramtypes", [members_service_1.MembersService])
], MembersController);
//# sourceMappingURL=members.controller.js.map