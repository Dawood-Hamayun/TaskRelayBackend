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
let InvitesService = class InvitesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createInvite(email, projectId, role = 'MEMBER') {
        return this.prisma.invite.create({
            data: {
                email,
                projectId,
                role,
            },
        });
    }
    async acceptInvite(email, userId) {
        const invites = await this.prisma.invite.findMany({
            where: { email },
        });
        if (invites.length === 0)
            throw new common_1.NotFoundException('No pending invites found');
        const membersToCreate = invites.map(invite => ({
            userId,
            projectId: invite.projectId,
            role: invite.role,
        }));
        await this.prisma.member.createMany({
            data: membersToCreate,
            skipDuplicates: true,
        });
        await this.prisma.invite.deleteMany({
            where: { email },
        });
        return { message: 'Invite accepted' };
    }
    async getProjectInvites(projectId) {
        return this.prisma.invite.findMany({
            where: { projectId },
        });
    }
};
exports.InvitesService = InvitesService;
exports.InvitesService = InvitesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvitesService);
//# sourceMappingURL=invites.service.js.map