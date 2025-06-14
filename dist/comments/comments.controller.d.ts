import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    createComment(req: any, taskId: string, body: CreateCommentDto): Promise<{
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
    deleteComment(req: any, commentId: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        authorId: string;
        taskId: string;
    }>;
}
