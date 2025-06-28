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
exports.InvitesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const crypto_1 = require("crypto");
let InvitesService = class InvitesService {
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async createInvite(email, projectId, invitedBy, role = 'MEMBER', message) {
        console.log('📧 Creating invite:', { email, projectId, role, invitedBy });
        const inviterMember = await this.prisma.member.findFirst({
            where: {
                userId: invitedBy,
                projectId,
                role: { in: ['OWNER', 'ADMIN'] }
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                project: { select: { id: true, name: true, description: true } }
            }
        });
        if (!inviterMember) {
            throw new common_1.ForbiddenException('You do not have permission to invite members to this project');
        }
        const existingMember = await this.prisma.member.findFirst({
            where: {
                projectId,
                user: { email }
            }
        });
        if (existingMember) {
            throw new common_1.BadRequestException('User is already a member of this project');
        }
        const existingInvite = await this.prisma.invite.findFirst({
            where: {
                email,
                projectId,
                status: 'PENDING'
            }
        });
        if (existingInvite) {
            throw new common_1.BadRequestException('User already has a pending invite to this project');
        }
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const invite = await this.prisma.invite.create({
            data: {
                email,
                projectId,
                role,
                token,
                status: 'PENDING',
                invitedBy,
                message,
                expiresAt
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                },
                inviter: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        try {
            await this.emailService.sendInviteEmail({
                recipientEmail: email,
                inviterName: inviterMember.user.name || inviterMember.user.email,
                inviterEmail: inviterMember.user.email,
                projectName: inviterMember.project.name,
                projectDescription: inviterMember.project.description,
                role,
                personalMessage: message,
                inviteToken: token,
                expiresAt
            });
            console.log('✅ Invite email sent successfully to:', email, 'with token:', token);
        }
        catch (emailError) {
            console.error('❌ Failed to send invite email:', emailError);
        }
        return invite;
    }
    async getInviteByToken(token) {
        console.log('🔍 Getting invite by token');
        const invite = await this.prisma.invite.findUnique({
            where: { token },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                },
                inviter: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        if (!invite) {
            throw new common_1.NotFoundException('Invite not found');
        }
        if (invite.status === 'PENDING' && new Date() > invite.expiresAt) {
            await this.prisma.invite.update({
                where: { id: invite.id },
                data: { status: 'EXPIRED' }
            });
            throw new common_1.BadRequestException('Invite has expired');
        }
        return invite;
    }
    async acceptInvite(token, userId) {
        console.log('✅ Accepting invite:', { token, userId });
        const invite = await this.prisma.invite.findUnique({
            where: { token },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                }
            }
        });
        if (!invite) {
            throw new common_1.NotFoundException('Invite not found');
        }
        if (invite.status !== 'PENDING') {
            throw new common_1.BadRequestException('Invite has already been processed');
        }
        if (new Date() > invite.expiresAt) {
            await this.prisma.invite.update({
                where: { id: invite.id },
                data: { status: 'EXPIRED' }
            });
            throw new common_1.BadRequestException('Invite has expired');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, name: true }
        });
        if (!user || user.email !== invite.email) {
            throw new common_1.ForbiddenException('This invite is not for your email address');
        }
        const existingMember = await this.prisma.member.findFirst({
            where: {
                userId,
                projectId: invite.projectId
            }
        });
        if (existingMember) {
            await this.prisma.invite.update({
                where: { id: invite.id },
                data: { status: 'ACCEPTED' }
            });
            throw new common_1.BadRequestException('You are already a member of this project');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const member = await tx.member.create({
                data: {
                    userId,
                    projectId: invite.projectId,
                    role: invite.role
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    project: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
            await tx.invite.update({
                where: { id: invite.id },
                data: { status: 'ACCEPTED' }
            });
            return member;
        });
        console.log('✅ Invite accepted successfully');
        return {
            message: 'Invite accepted successfully',
            member: result,
            project: invite.project
        };
    }
    async declineInvite(token) {
        console.log('❌ Declining invite:', token);
        const invite = await this.prisma.invite.findUnique({
            where: { token }
        });
        if (!invite) {
            throw new common_1.NotFoundException('Invite not found');
        }
        if (invite.status !== 'PENDING') {
            throw new common_1.BadRequestException('Invite has already been processed');
        }
        await this.prisma.invite.update({
            where: { id: invite.id },
            data: { status: 'DECLINED' }
        });
        return { message: 'Invite declined' };
    }
    async getProjectInvites(projectId, userId) {
        console.log('📋 Getting project invites:', { projectId, userId });
        const member = await this.prisma.member.findFirst({
            where: {
                userId,
                projectId,
                role: { in: ['OWNER', 'ADMIN'] }
            }
        });
        if (!member) {
            throw new common_1.ForbiddenException('You do not have permission to view invites for this project');
        }
        return this.prisma.invite.findMany({
            where: {
                projectId,
                status: 'PENDING'
            },
            include: {
                inviter: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async cancelInvite(inviteId, userId) {
        console.log('🗑️ Cancelling invite:', { inviteId, userId });
        const invite = await this.prisma.invite.findUnique({
            where: { id: inviteId },
            include: {
                project: {
                    include: {
                        members: {
                            where: {
                                userId,
                                role: { in: ['OWNER', 'ADMIN'] }
                            }
                        }
                    }
                }
            }
        });
        if (!invite) {
            throw new common_1.NotFoundException('Invite not found');
        }
        const canCancel = invite.invitedBy === userId ||
            invite.project.members.length > 0;
        if (!canCancel) {
            throw new common_1.ForbiddenException('You do not have permission to cancel this invite');
        }
        if (invite.status !== 'PENDING') {
            throw new common_1.BadRequestException('Only pending invites can be cancelled');
        }
        await this.prisma.invite.delete({
            where: { id: inviteId }
        });
        return { message: 'Invite cancelled successfully' };
    }
    async resendInvite(inviteId, userId) {
        console.log('🔄 Resending invite:', { inviteId, userId });
        const invite = await this.prisma.invite.findUnique({
            where: { id: inviteId },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    },
                    include: {
                        members: {
                            where: {
                                userId,
                                role: { in: ['OWNER', 'ADMIN'] }
                            },
                            include: {
                                user: { select: { name: true, email: true } }
                            }
                        }
                    }
                },
                inviter: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        if (!invite) {
            throw new common_1.NotFoundException('Invite not found');
        }
        const canResend = invite.invitedBy === userId ||
            invite.project.members.length > 0;
        if (!canResend) {
            throw new common_1.ForbiddenException('You do not have permission to resend this invite');
        }
        if (invite.status !== 'PENDING') {
            throw new common_1.BadRequestException('Only pending invites can be resent');
        }
        const newToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const updatedInvite = await this.prisma.invite.update({
            where: { id: inviteId },
            data: {
                token: newToken,
                expiresAt: newExpiresAt
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                },
                inviter: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        try {
            const currentUser = invite.project.members[0]?.user;
            await this.emailService.sendInviteEmail({
                recipientEmail: invite.email,
                inviterName: currentUser?.name || currentUser?.email || 'Team member',
                inviterEmail: currentUser?.email || '',
                projectName: invite.project.name,
                projectDescription: invite.project.description,
                role: invite.role,
                personalMessage: invite.message,
                inviteToken: newToken,
                expiresAt: newExpiresAt
            });
            console.log('✅ Resend invite email sent successfully');
        }
        catch (emailError) {
            console.error('❌ Failed to send resend invite email:', emailError);
        }
        return {
            message: 'Invite resent successfully',
            invite: updatedInvite
        };
    }
};
exports.InvitesService = InvitesService;
exports.InvitesService = InvitesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], InvitesService);
//# sourceMappingURL=invites.service.js.map