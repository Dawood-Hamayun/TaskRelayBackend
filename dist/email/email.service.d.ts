interface InviteEmailData {
    recipientEmail: string;
    recipientName?: string;
    inviterName: string;
    inviterEmail: string;
    projectName: string;
    projectDescription?: string;
    role: string;
    personalMessage?: string;
    inviteToken: string;
    expiresAt: Date;
}
export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    sendInviteEmail(data: InviteEmailData): Promise<void>;
    private generateInviteEmailHtml;
    private generateInviteEmailText;
    private getRoleDescription;
    sendWelcomeEmail(recipientEmail: string, projectName: string): Promise<void>;
}
export {};
