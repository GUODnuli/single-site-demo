import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService, Logger, RequestContext } from '@vendure/core';
import { ContactSubmission } from '../entities/contact-submission.entity';

interface EmailConfig {
  enabled: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  fromEmail: string;
  toEmails: string[];
}

@Injectable()
export class EmailNotificationService implements OnModuleInit {
  private config: EmailConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true',
      smtpHost: process.env.SMTP_HOST,
      smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
      smtpUser: process.env.SMTP_USER,
      smtpPass: process.env.SMTP_PASS,
      fromEmail: process.env.EMAIL_FROM || 'noreply@curtainshowcase.com',
      toEmails: (process.env.EMAIL_NOTIFY_TO || '').split(',').filter(Boolean),
    };
  }

  onModuleInit() {
    if (this.config.enabled) {
      Logger.info('Email notifications enabled');
    } else {
      Logger.info('Email notifications disabled');
    }
  }
  async sendContactNotification(
    ctx: RequestContext,
    submission: ContactSubmission,
  ): Promise<boolean> {
    if (!this.config.enabled || this.config.toEmails.length === 0) {
      Logger.debug('Email notification skipped: not configured');
      return false;
    }
    try {
      const emailContent = this.buildEmailContent(submission);

      // In production, integrate with your email service (SendGrid, AWS SES, etc.)
      // For now, we'll log the email content and simulate sending
      Logger.info(`Contact notification email:
        To: ${this.config.toEmails.join(', ')}
        Subject: ${emailContent.subject}
        From: ${submission.name} <${submission.email}>
      `);
      // If using nodemailer (add nodemailer to package.json):
      // await this.sendViaNodemailer(emailContent);

      // If using SendGrid (add @sendgrid/mail to package.json):
      // await this.sendViaSendGrid(emailContent);

      return true;
    } catch (error) {
      Logger.error(`Failed to send contact notification: ${error}`);
      return false;
    }
  }

  private buildEmailContent(submission: ContactSubmission): {
    subject: string;
    text: string;
    html: string;
  } {
    const subject = `New Contact Form Submission from ${submission.name}`;

    const text = `
New Contact Form Submission
============================

Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone || 'Not provided'}
Company: ${submission.company || 'Not provided'}
Source: ${submission.source || 'Website'}

Message:
${submission.message}

---
Submitted at: ${submission.createdAt.toISOString()}
IP Address: ${submission.ipAddress || 'Unknown'}
User Agent: ${submission.userAgent || 'Unknown'}
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .field { margin-bottom: 15px; }
    .field-label { font-weight: bold; color: #666; }
    .field-value { margin-top: 5px; }
    .message-box { background: white; padding: 15px; border-left: 4px solid #007bff; margin-top: 20px; }
    .footer { padding: 15px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">Name</div>
        <div class="field-value">${this.escapeHtml(submission.name)}</div>
      </div>
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value"><a href="mailto:${this.escapeHtml(submission.email)}">${this.escapeHtml(submission.email)}</a></div>
      </div>
      <div class="field">
        <div class="field-label">Phone</div>
        <div class="field-value">${submission.phone ? this.escapeHtml(submission.phone) : '<em>Not provided</em>'}</div>
      </div>
      <div class="field">
        <div class="field-label">Company</div>
        <div class="field-value">${submission.company ? this.escapeHtml(submission.company) : '<em>Not provided</em>'}</div>
      </div>
      <div class="message-box">
        <div class="field-label">Message</div>
        <div class="field-value" style="white-space: pre-wrap;">${this.escapeHtml(submission.message)}</div>
      </div>
    </div>
    <div class="footer">
      <p>Submitted via ${submission.source || 'Website'} at ${submission.createdAt.toISOString()}</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    return { subject, text, html };
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  }

  // Example: Integration with nodemailer
  // private async sendViaNodemailer(content: { subject: string; text: string; html: string }) {
  //   const nodemailer = await import('nodemailer');
  //   const transporter = nodemailer.createTransport({
  //     host: this.config.smtpHost,
  //     port: this.config.smtpPort,
  //     secure: this.config.smtpPort === 465,
  //     auth: {
  //       user: this.config.smtpUser,
  //       pass: this.config.smtpPass,
  //     },
  //   });
  //
  //   await transporter.sendMail({
  //     from: this.config.fromEmail,
  //     to: this.config.toEmails.join(', '),
  //     subject: content.subject,
  //     text: content.text,
  //     html: content.html,
  //   });
  // }
}
