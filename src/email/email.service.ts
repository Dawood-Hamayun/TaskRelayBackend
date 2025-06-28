// backend/src/email/email.service.ts - Fixed with proper invite URL
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendInviteEmail(data: InviteEmailData): Promise<void> {
    try {
      // ✅ FIXED: Proper invite URL that goes to the invite acceptance page
      const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invites/${data.inviteToken}`;
      console.log('📧 Generated invite URL:', inviteUrl);
      
      const expiryDays = Math.ceil((data.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      const htmlContent = this.generateInviteEmailHtml(data, inviteUrl, expiryDays);
      const textContent = this.generateInviteEmailText(data, inviteUrl, expiryDays);

      await this.transporter.sendMail({
        from: `"TaskRelay" <${process.env.SMTP_FROM || 'noreply@taskrelay.com'}>`,
        to: data.recipientEmail,
        subject: `You're invited to join ${data.projectName} on TaskRelay`,
        text: textContent,
        html: htmlContent,
      });

      this.logger.log(`Invite email sent to ${data.recipientEmail} for project ${data.projectName} with URL: ${inviteUrl}`);
    } catch (error) {
      this.logger.error(`Failed to send invite email to ${data.recipientEmail}:`, error);
      throw error;
    }
  }

  private generateInviteEmailHtml(data: InviteEmailData, inviteUrl: string, expiryDays: number): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're invited to join ${data.projectName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 0; text-align: center; }
    .logo { color: #ffffff; font-size: 24px; font-weight: bold; margin: 0; }
    .content { padding: 40px; }
    .project-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .role-badge { display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500; }
    .cta-button { display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .cta-button:hover { background-color: #2563eb; }
    .footer { background-color: #f1f5f9; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
    .message-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px; }
    .url-box { background-color: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; padding: 12px; margin: 16px 0; font-family: monospace; word-break: break-all; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">TaskRelay</h1>
      <p style="color: #e0e7ff; margin: 8px 0 0 0;">Project Collaboration Made Simple</p>
    </div>
    
    <div class="content">
      <h2 style="color: #1f2937; margin: 0 0 16px 0;">You're invited to collaborate!</h2>
      
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
        <strong>${data.inviterName}</strong> has invited you to join their project on TaskRelay.
      </p>

      <div class="project-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <div>
            <h3 style="color: #111827; margin: 0 0 8px 0; font-size: 20px;">${data.projectName}</h3>
            ${data.projectDescription ? `<p style="color: #6b7280; margin: 0; font-size: 14px;">${data.projectDescription}</p>` : ''}
          </div>
          <span class="role-badge">${data.role}</span>
        </div>
        
        <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h4 style="color: #374151; margin: 0 0 8px 0; font-size: 14px;">As a ${data.role}, you'll be able to:</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">
            ${this.getRoleDescription(data.role)}
          </p>
        </div>
      </div>

      ${data.personalMessage ? `
      <div class="message-box">
        <p style="margin: 0; font-style: italic; color: #92400e;">
          "${data.personalMessage}"
        </p>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #a16207;">
          — ${data.inviterName}
        </p>
      </div>
      ` : ''}

      <div style="text-align: center; margin: 32px 0;">
        <a href="${inviteUrl}" class="cta-button">Accept Invitation</a>
      </div>

      <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="color: #dc2626; margin: 0; font-size: 14px; font-weight: 500;">
          ⏰ This invitation expires in ${expiryDays} days
        </p>
      </div>

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        If you're unable to click the button above, copy and paste this link into your browser:
      </p>
      <div class="url-box">${inviteUrl}</div>
    </div>

    <div class="footer">
      <p>This invitation was sent by ${data.inviterName} (${data.inviterEmail})</p>
      <p>If you weren't expecting this invitation, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>`;
  }

  private generateInviteEmailText(data: InviteEmailData, inviteUrl: string, expiryDays: number): string {
    return `
You're invited to join ${data.projectName} on TaskRelay

${data.inviterName} has invited you to collaborate on their project.

Project: ${data.projectName}
${data.projectDescription ? `Description: ${data.projectDescription}` : ''}
Your role: ${data.role}

${data.personalMessage ? `Personal message from ${data.inviterName}:\n"${data.personalMessage}"\n` : ''}

Accept your invitation: ${inviteUrl}

This invitation expires in ${expiryDays} days.

If you weren't expecting this invitation, you can safely ignore this email.

---
TaskRelay - Project Collaboration Made Simple
`;
  }

  private getRoleDescription(role: string): string {
    const descriptions = {
      OWNER: 'Full control over the project, including managing members and settings',
      ADMIN: 'Manage team members, project settings, and all project content',
      MEMBER: 'Create and edit tasks, comment on discussions, and collaborate with the team',
      VIEWER: 'View project content and progress, but cannot make changes'
    };
    return descriptions[role] || 'Collaborate on this project';
  }

  async sendWelcomeEmail(recipientEmail: string, projectName: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"TaskRelay" <${process.env.SMTP_FROM || 'noreply@taskrelay.com'}>`,
        to: recipientEmail,
        subject: `Welcome to ${projectName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to ${projectName}!</h2>
            <p>You've successfully joined the team. Start collaborating and get things done!</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
               style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Go to Project
            </a>
          </div>
        `,
      });

      this.logger.log(`Welcome email sent to ${recipientEmail} for project ${projectName}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${recipientEmail}:`, error);
      // Don't throw - welcome email failure shouldn't break the flow
    }
  }
}