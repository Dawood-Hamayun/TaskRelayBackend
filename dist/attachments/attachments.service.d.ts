import { PrismaService } from '../prisma/prisma.service';
export declare class AttachmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    addAttachment(taskId: string, fileName: string, url: string): Promise<{
        id: string;
        createdAt: Date;
        taskId: string;
        url: string;
        fileName: string;
    }>;
    getTaskAttachments(taskId: string): Promise<{
        id: string;
        createdAt: Date;
        taskId: string;
        url: string;
        fileName: string;
    }[]>;
}
