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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProject(userId, name, description) {
        console.log('Creating project with userId:', userId, 'name:', name, 'description:', description);
        try {
            const project = await this.prisma.project.create({
                data: {
                    name,
                    description,
                    members: {
                        create: {
                            userId: userId,
                            role: 'OWNER'
                        }
                    }
                },
                include: {
                    members: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    name: true
                                }
                            }
                        }
                    },
                    tasks: {
                        select: {
                            id: true,
                            status: true,
                            priority: true,
                            dueDate: true,
                            createdAt: true
                        }
                    },
                    meetings: {
                        select: {
                            id: true,
                            title: true,
                            datetime: true
                        },
                        where: {
                            datetime: {
                                gte: new Date()
                            }
                        },
                        orderBy: {
                            datetime: 'asc'
                        },
                        take: 5
                    },
                    tags: {
                        select: {
                            id: true,
                            name: true,
                            color: true
                        }
                    },
                    _count: {
                        select: {
                            tasks: true,
                            members: true
                        }
                    }
                }
            });
            const transformedProject = this.transformProjectData(project);
            console.log('Project created successfully:', transformedProject);
            return transformedProject;
        }
        catch (error) {
            console.error('Database error creating project:', error);
            throw error;
        }
    }
    async getUserProjects(userId) {
        console.log('Getting projects for userId:', userId);
        try {
            const projects = await this.prisma.project.findMany({
                where: {
                    members: {
                        some: { userId }
                    }
                },
                include: {
                    members: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    name: true
                                }
                            }
                        },
                        orderBy: [
                            { role: 'asc' },
                            { createdAt: 'asc' }
                        ]
                    },
                    tasks: {
                        select: {
                            id: true,
                            status: true,
                            priority: true,
                            dueDate: true,
                            createdAt: true
                        }
                    },
                    meetings: {
                        select: {
                            id: true,
                            title: true,
                            datetime: true
                        },
                        where: {
                            datetime: {
                                gte: new Date()
                            }
                        },
                        orderBy: {
                            datetime: 'asc'
                        },
                        take: 5
                    },
                    tags: {
                        select: {
                            id: true,
                            name: true,
                            color: true
                        },
                        orderBy: {
                            name: 'asc'
                        }
                    },
                    _count: {
                        select: {
                            tasks: true,
                            members: true
                        }
                    }
                },
                orderBy: [
                    { createdAt: 'desc' }
                ]
            });
            const transformedProjects = projects.map(project => this.transformProjectData(project));
            console.log('Found projects:', transformedProjects.length);
            return transformedProjects;
        }
        catch (error) {
            console.error('Database error getting projects:', error);
            throw error;
        }
    }
    async getProjectById(projectId, userId) {
        console.log('Getting project by ID:', projectId, 'for user:', userId);
        const member = await this.prisma.member.findFirst({
            where: {
                userId,
                projectId
            }
        });
        if (!member) {
            throw new common_1.ForbiddenException('You do not have access to this project');
        }
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                name: true
                            }
                        }
                    },
                    orderBy: [
                        { role: 'asc' },
                        { createdAt: 'asc' }
                    ]
                },
                tasks: {
                    select: {
                        id: true,
                        status: true,
                        priority: true,
                        dueDate: true,
                        createdAt: true
                    }
                },
                meetings: {
                    select: {
                        id: true,
                        title: true,
                        datetime: true
                    },
                    where: {
                        datetime: {
                            gte: new Date()
                        }
                    },
                    orderBy: {
                        datetime: 'asc'
                    },
                    take: 5
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                        color: true
                    },
                    orderBy: {
                        name: 'asc'
                    }
                },
                _count: {
                    select: {
                        tasks: true,
                        members: true
                    }
                }
            }
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        return this.transformProjectData(project);
    }
    async updateProject(projectId, userId, data) {
        console.log('Updating project:', projectId, 'by user:', userId, 'with data:', data);
        const member = await this.prisma.member.findFirst({
            where: {
                userId,
                projectId,
                role: { in: ['OWNER', 'ADMIN'] }
            }
        });
        if (!member) {
            throw new common_1.ForbiddenException('You do not have permission to update this project');
        }
        const project = await this.prisma.project.update({
            where: { id: projectId },
            data,
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                name: true
                            }
                        }
                    }
                },
                tasks: {
                    select: {
                        id: true,
                        status: true,
                        priority: true,
                        dueDate: true,
                        createdAt: true
                    }
                },
                meetings: {
                    select: {
                        id: true,
                        title: true,
                        datetime: true
                    },
                    where: {
                        datetime: {
                            gte: new Date()
                        }
                    },
                    orderBy: {
                        datetime: 'asc'
                    },
                    take: 5
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                        color: true
                    }
                },
                _count: {
                    select: {
                        tasks: true,
                        members: true
                    }
                }
            }
        });
        return this.transformProjectData(project);
    }
    async deleteProject(projectId, userId) {
        console.log('Deleting project:', projectId, 'by user:', userId);
        const owner = await this.prisma.member.findFirst({
            where: {
                userId,
                projectId,
                role: 'OWNER'
            }
        });
        if (!owner) {
            throw new common_1.ForbiddenException('Only project owners can delete projects');
        }
        await this.prisma.project.delete({
            where: { id: projectId }
        });
        return { message: 'Project deleted successfully' };
    }
    transformProjectData(project) {
        const taskStats = this.calculateTaskStats(project.tasks);
        const lastActivity = this.calculateLastActivity(project.tasks, project.createdAt);
        const status = this.determineProjectStatus(taskStats);
        const membersWithAvatars = project.members.map((member, index) => ({
            ...member,
            user: {
                ...member.user,
                avatar: this.generateAvatar(member.user.name || member.user.email),
                color: this.generateUserColor(member.user.id, index)
            }
        }));
        return {
            id: project.id,
            name: project.name,
            description: project.description || null,
            members: membersWithAvatars,
            tasks: taskStats,
            meetings: project.meetings || [],
            tags: project.tags || [],
            createdAt: project.createdAt,
            lastActivity,
            status,
            _count: project._count
        };
    }
    calculateTaskStats(tasks) {
        const stats = {
            total: tasks.length,
            completed: 0,
            inProgress: 0,
            overdue: 0,
            todo: 0
        };
        const now = new Date();
        tasks.forEach(task => {
            switch (task.status) {
                case 'DONE':
                    stats.completed++;
                    break;
                case 'IN_PROGRESS':
                case 'IN_REVIEW':
                    stats.inProgress++;
                    break;
                case 'TODO':
                case 'BACKLOG':
                    stats.todo++;
                    break;
            }
            if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'DONE') {
                stats.overdue++;
            }
        });
        return stats;
    }
    calculateLastActivity(tasks, projectCreatedAt) {
        if (tasks.length === 0) {
            return projectCreatedAt;
        }
        const mostRecentTask = tasks.reduce((latest, task) => {
            return new Date(task.createdAt) > new Date(latest.createdAt) ? task : latest;
        }, tasks[0]);
        return mostRecentTask.createdAt;
    }
    determineProjectStatus(taskStats) {
        if (taskStats.total === 0)
            return 'active';
        if (taskStats.completed === taskStats.total)
            return 'completed';
        return 'active';
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
            'bg-zinc-600',
            'bg-slate-600',
            'bg-gray-600',
            'bg-stone-600',
            'bg-red-600',
            'bg-orange-600',
            'bg-amber-600',
            'bg-yellow-600',
            'bg-lime-600',
            'bg-green-600',
            'bg-emerald-600',
            'bg-teal-600',
            'bg-cyan-600',
            'bg-sky-600',
            'bg-blue-600',
            'bg-indigo-600',
            'bg-violet-600',
            'bg-purple-600',
            'bg-fuchsia-600',
            'bg-pink-600',
            'bg-rose-600'
        ];
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = ((hash << 5) - hash + userId.charCodeAt(i)) & 0xffffffff;
        }
        return colors[Math.abs(hash) % colors.length];
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map