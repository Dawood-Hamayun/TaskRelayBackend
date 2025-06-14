import { PrismaService } from '../prisma/prisma.service';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    createComment(userId: string, taskId: string, content: string): Promise<{
        author: {
            id: string;
            email: string;
            createdAt: Date;
            name: string | null;
            password: string;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        taskId: string;
    }>;
    getTaskComments(taskId: string): Promise<({
        author: {
            id: string;
            email: string;
            createdAt: Date;
            name: string | null;
            password: string;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        taskId: string;
    })[]>;
    deleteComment(commentId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        taskId: string;
    }>;
}
