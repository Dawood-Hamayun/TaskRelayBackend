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
var MembersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MembersService = MembersService_1 = class MembersService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MembersService_1.name);
        this.logger.log('MembersService initialized');
    }
    async updateMemberRole(projectId, memberId, newRole, requestingUserId) {
        this.logger.log('Updating member role:', { projectId, memberId, newRole, requestingUserId });
        if (!projectId || !memberId || !newRole || !requestingUserId) {
            throw new common_1.BadRequestException('Missing required parameters');
        }
        const requestingMember = await this.prisma.member.findFirst({
            where: {
                userId: requestingUserId,
                projectId,
                role: { in: ['OWNER', 'ADMIN'] }
            }
        });
        if (!requestingMember) {
            throw new common_1.ForbiddenException('You do not have permission to change member roles');
        }
        const targetMember = await this.prisma.member.findUnique({
            where: { id: memberId },
            include: {
                user: { select: { id: true, name: true, email: true } }
            }
        });
        if (!targetMember) {
            throw new common_1.NotFoundException('Member not found');
        }
        if (targetMember.projectId !== projectId) {
            throw new common_1.BadRequestException('Member does not belong to this project');
        }
        const canChangeRole = this.canChangeRole(requestingMember.role, targetMember.role, newRole, requestingUserId === targetMember.userId);
        if (!canChangeRole.allowed) {
            throw new common_1.ForbiddenException(canChangeRole.reason);
        }
        if (newRole === 'OWNER') {
            return this.transferOwnership(projectId, targetMember.userId, requestingUserId);
        }
        const updatedMember = await this.prisma.member.update({
            where: { id: memberId },
            data: { role: newRole },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        this.logger.log('Member role updated successfully');
        return {
            ...updatedMember,
            user: {
                ...updatedMember.user,
                avatar: this.generateAvatar(updatedMember.user.name || updatedMember.user.email),
                color: this.generateUserColor(updatedMember.user.id, 0)
            }
        };
    }
    async removeMember(projectId, memberId, requestingUserId) {
        this.logger.log('Removing member:', { projectId, memberId, requestingUserId });
        if (!projectId || !memberId || !requestingUserId) {
            throw new common_1.BadRequestException('Missing required parameters');
        }
        const targetMember = await this.prisma.member.findUnique({
            where: { id: memberId },
            include: {
                user: { select: { id: true, name: true, email: true } }
            }
        });
        if (!targetMember) {
            throw new common_1.NotFoundException('Member not found');
        }
        if (targetMember.projectId !== projectId) {
            throw new common_1.BadRequestException('Member does not belong to this project');
        }
        const isSelfRemoval = requestingUserId === targetMember.userId;
        if (!isSelfRemoval) {
            const requestingMember = await this.prisma.member.findFirst({
                where: {
                    userId: requestingUserId,
                    projectId,
                    role: { in: ['OWNER', 'ADMIN'] }
                }
            });
            if (!requestingMember) {
                throw new common_1.ForbiddenException('You do not have permission to remove members');
            }
            const canRemove = this.canRemoveMember(requestingMember.role, targetMember.role, isSelfRemoval);
            if (!canRemove.allowed) {
                throw new common_1.ForbiddenException(canRemove.reason);
            }
        }
        if (targetMember.role === 'OWNER') {
            const ownerCount = await this.prisma.member.count({
                where: {
                    projectId,
                    role: 'OWNER'
                }
            });
            if (ownerCount <= 1) {
                throw new common_1.BadRequestException('Cannot remove the last owner. Transfer ownership first.');
            }
        }
        await this.prisma.member.delete({
            where: { id: memberId }
        });
        this.logger.log('Member removed successfully');
        return { message: 'Member removed successfully' };
    }
    async transferOwnership(projectId, newOwnerId, currentOwnerId) {
        this.logger.log('Transferring ownership:', { projectId, newOwnerId, currentOwnerId });
        return this.prisma.$transaction(async (tx) => {
            await tx.member.updateMany({
                where: {
                    projectId,
                    userId: currentOwnerId,
                    role: 'OWNER'
                },
                data: { role: 'ADMIN' }
            });
            const targetMember = await tx.member.findFirst({
                where: {
                    userId: newOwnerId,
                    projectId
                }
            });
            if (!targetMember) {
                throw new common_1.NotFoundException('Target member not found in project');
            }
            const newOwner = await tx.member.update({
                where: { id: targetMember.id },
                data: { role: 'OWNER' },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });
            this.logger.log('Ownership transferred successfully');
            return {
                ...newOwner,
                user: {
                    ...newOwner.user,
                    avatar: this.generateAvatar(newOwner.user.name || newOwner.user.email),
                    color: this.generateUserColor(newOwner.user.id, 0)
                }
            };
        });
    }
    canChangeRole(requestingRole, targetCurrentRole, targetNewRole, isSelf) {
        if (requestingRole === 'OWNER') {
            if (targetCurrentRole === 'OWNER' && !isSelf) {
                return { allowed: false, reason: 'Cannot change another owner\'s role' };
            }
            return { allowed: true };
        }
        if (requestingRole === 'ADMIN') {
            if (targetCurrentRole === 'OWNER') {
                return { allowed: false, reason: 'Cannot change owner\'s role' };
            }
            if (targetCurrentRole === 'ADMIN' && !isSelf) {
                return { allowed: false, reason: 'Cannot change another admin\'s role' };
            }
            if (targetNewRole === 'OWNER') {
                return { allowed: false, reason: 'Cannot promote to owner' };
            }
            return { allowed: true };
        }
        return { allowed: false, reason: 'Insufficient permissions' };
    }
    canRemoveMember(requestingRole, targetRole, isSelf) {
        if (isSelf && ['MEMBER', 'VIEWER'].includes(requestingRole)) {
            return { allowed: true };
        }
        if (requestingRole === 'OWNER') {
            if (targetRole === 'OWNER' && !isSelf) {
                return { allowed: false, reason: 'Cannot remove another owner' };
            }
            return { allowed: true };
        }
        if (requestingRole === 'ADMIN') {
            if (['OWNER', 'ADMIN'].includes(targetRole) && !isSelf) {
                return { allowed: false, reason: 'Cannot remove owner or admin' };
            }
            return { allowed: true };
        }
        return { allowed: false, reason: 'Insufficient permissions' };
    }
    generateAvatar(nameOrEmail) {
        if (!nameOrEmail)
            return '?';
        const parts = nameOrEmail.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        if (nameOrEmail.includes('@')) {
            const emailParts = nameOrEmail.split('@')[0].split('.');
            if (emailParts.length >= 2) {
                return (emailParts[0][0] + emailParts[1][0]).toUpperCase();
            }
            return nameOrEmail[0].toUpperCase();
        }
        return nameOrEmail.slice(0, 2).toUpperCase();
    }
    generateUserColor(userId, index) {
        const colors = [
            'bg-zinc-600', 'bg-slate-600', 'bg-gray-600', 'bg-stone-600',
            'bg-red-600', 'bg-orange-600', 'bg-amber-600', 'bg-yellow-600',
            'bg-lime-600', 'bg-green-600', 'bg-emerald-600', 'bg-teal-600',
            'bg-cyan-600', 'bg-sky-600', 'bg-blue-600', 'bg-indigo-600',
            'bg-violet-600', 'bg-purple-600', 'bg-fuchsia-600', 'bg-pink-600',
            'bg-rose-600'
        ];
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = ((hash << 5) - hash + userId.charCodeAt(i)) & 0xffffffff;
        }
        return colors[Math.abs(hash) % colors.length];
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = MembersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MembersService);
//# sourceMappingURL=members.service.js.map