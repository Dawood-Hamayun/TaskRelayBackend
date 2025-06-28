import { AttachmentsService } from './attachments.service';
import { AddAttachmentDto } from './dto/add-attachment.dto';
export declare class AttachmentsController {
    private readonly attachmentsService;
    constructor(attachmentsService: AttachmentsService);
    addAttachment(taskId: string, body: AddAttachmentDto): Promise<{
        id: string;
        createdAt: Date;
        taskId: string;
        url: string;
        fileName: string;
        fileSize: number | null;
        mimeType: string | null;
    }>;
    getTaskAttachments(taskId: string): Promise<{
        id: string;
        createdAt: Date;
        taskId: string;
        url: string;
        fileName: string;
        fileSize: number | null;
        mimeType: string | null;
    }[]>;
}
