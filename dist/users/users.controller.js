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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_dto_1 = require("./dto/user.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getAllUsers(req) {
        console.log('Getting all users, requested by:', req.user.email);
        return this.usersService.getAllUsers();
    }
    getCurrentUser(req) {
        console.log('Getting current user:', req.user.userId);
        return this.usersService.getCurrentUser(req.user.userId);
    }
    getUserStats(req) {
        console.log('Getting user stats:', req.user.userId);
        return this.usersService.getUserStats(req.user.userId);
    }
    updateProfile(req, updateUserDto) {
        console.log('Updating profile for user:', req.user.userId, 'with data:', updateUserDto);
        return this.usersService.updateProfile(req.user.userId, updateUserDto);
    }
    updatePassword(req, updatePasswordDto) {
        console.log('Updating password for user:', req.user.userId);
        return this.usersService.updatePassword(req.user.userId, updatePasswordDto);
    }
    updateAvatar(req, updateAvatarDto) {
        console.log('🎭 Avatar update request received:', {
            userId: req.user.userId,
            hasAvatar: !!updateAvatarDto.avatar,
            avatarLength: updateAvatarDto.avatar?.length || 0,
            bodyKeys: Object.keys(updateAvatarDto),
            bodyType: typeof updateAvatarDto.avatar
        });
        try {
            return this.usersService.updateAvatar(req.user.userId, updateAvatarDto);
        }
        catch (error) {
            console.error('❌ Avatar update error in controller:', error);
            throw error;
        }
    }
    removeAvatar(req) {
        console.log('Removing avatar for user:', req.user.userId);
        return this.usersService.removeAvatar(req.user.userId);
    }
    deleteAccount(req, deleteAccountDto) {
        console.log('Deleting account for user:', req.user.userId);
        return this.usersService.deleteAccount(req.user.userId, deleteAccountDto.password);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Get)('me/stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Put)('me/profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('me/password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Put)('me/avatar'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UpdateProfilePictureDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateAvatar", null);
__decorate([
    (0, common_1.Delete)('me/avatar'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "removeAvatar", null);
__decorate([
    (0, common_1.Delete)('me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.DeleteAccountDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteAccount", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map