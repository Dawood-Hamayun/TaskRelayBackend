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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async signup(email, password, name, inviteToken) {
        console.log('🔐 Signup attempt:', { email, name, hasInviteToken: !!inviteToken });
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        let validInvite = null;
        if (inviteToken) {
            validInvite = await this.validateInviteForSignup(email, inviteToken);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                createdAt: true,
            }
        });
        console.log('✅ User created:', { userId: user.id, email: user.email });
        if (validInvite) {
            await this.acceptInviteForNewUser(user.id, validInvite);
            console.log('✅ Auto-accepted invite for new user');
        }
        const payload = { sub: user.id, email: user.email };
        const access_token = await this.jwtService.signAsync(payload);
        return {
            access_token,
            message: validInvite
                ? `Account created and joined ${validInvite.project.name}!`
                : 'Account created successfully!',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                createdAt: user.createdAt
            },
            autoAcceptedProject: validInvite ? {
                id: validInvite.project.id,
                name: validInvite.project.name
            } : null
        };
    }
    async login(email, password, inviteToken) {
        console.log('🔐 Login attempt:', { email, hasInviteToken: !!inviteToken });
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                password: true,
                createdAt: true,
            }
        });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const payload = { sub: user.id, email: user.email };
        const access_token = await this.jwtService.signAsync(payload);
        console.log('✅ Login successful for user:', user.email);
        let acceptedInvite = null;
        if (inviteToken) {
            try {
                const validInvite = await this.validateInviteForLogin(email, inviteToken);
                if (validInvite) {
                    acceptedInvite = await this.acceptInviteForExistingUser(user.id, validInvite);
                    console.log('✅ Auto-accepted invite after login');
                }
            }
            catch (error) {
                console.warn('⚠️ Could not auto-accept invite:', error.message);
            }
        }
        const { password: _, ...userWithoutPassword } = user;
        return {
            access_token,
            message: acceptedInvite
                ? `Logged in and joined ${acceptedInvite.project.name}!`
                : 'Login successful!',
            user: userWithoutPassword,
            autoAcceptedProject: acceptedInvite ? {
                id: acceptedInvite.project.id,
                name: acceptedInvite.project.name
            } : null
        };
    }
    async validateInviteForSignup(email, token) {
        const invite = await this.prisma.invite.findUnique({
            where: { token },
            include: {
                project: { select: { id: true, name: true } },
                inviter: { select: { name: true, email: true } }
            }
        });
        if (!invite) {
            throw new common_1.BadRequestException('Invalid invite link');
        }
        if (invite.status !== 'PENDING') {
            throw new common_1.BadRequestException('This invite has already been processed');
        }
        if (new Date() > invite.expiresAt) {
            await this.prisma.invite.update({
                where: { id: invite.id },
                data: { status: 'EXPIRED' }
            });
            throw new common_1.BadRequestException('This invite has expired');
        }
        if (invite.email !== email) {
            throw new common_1.BadRequestException('This invite is for a different email address');
        }
        return invite;
    }
    async validateInviteForLogin(email, token) {
        const invite = await this.prisma.invite.findUnique({
            where: { token },
            include: {
                project: { select: { id: true, name: true } },
                inviter: { select: { name: true, email: true } }
            }
        });
        if (!invite || invite.status !== 'PENDING' || new Date() > invite.expiresAt) {
            return null;
        }
        if (invite.email !== email) {
            return null;
        }
        const existingMember = await this.prisma.member.findFirst({
            where: {
                user: { email },
                projectId: invite.projectId
            }
        });
        if (existingMember) {
            await this.prisma.invite.update({
                where: { id: invite.id },
                data: { status: 'ACCEPTED' }
            });
            return null;
        }
        return invite;
    }
    async acceptInviteForNewUser(userId, invite) {
        return this.prisma.$transaction(async (tx) => {
            const member = await tx.member.create({
                data: {
                    userId,
                    projectId: invite.projectId,
                    role: invite.role
                },
                include: {
                    project: { select: { id: true, name: true } },
                    user: { select: { id: true, name: true, email: true } }
                }
            });
            await tx.invite.update({
                where: { id: invite.id },
                data: { status: 'ACCEPTED' }
            });
            return member;
        });
    }
    async acceptInviteForExistingUser(userId, invite) {
        return this.prisma.$transaction(async (tx) => {
            const member = await tx.member.create({
                data: {
                    userId,
                    projectId: invite.projectId,
                    role: invite.role
                },
                include: {
                    project: { select: { id: true, name: true } },
                    user: { select: { id: true, name: true, email: true } }
                }
            });
            await tx.invite.update({
                where: { id: invite.id },
                data: { status: 'ACCEPTED' }
            });
            return member;
        });
    }
    async checkPendingInvites(email) {
        const invites = await this.prisma.invite.findMany({
            where: {
                email,
                status: 'PENDING',
                expiresAt: { gt: new Date() }
            },
            include: {
                project: { select: { id: true, name: true, description: true } },
                inviter: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return invites;
    }
    async validateUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                createdAt: true,
            }
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map