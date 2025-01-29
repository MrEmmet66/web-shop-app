import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';

enum EmailTemplates {
    CONFIRMATION = 'confirmation',
    PASSWORD_RESTORE = 'passwordRestore'
}

enum EmailSubjects {
    CONFIRMATION = '[Web-Shop] Confirm your email',
    PASSWORD_RESTORE = '[Web-Shop] Reset your password'
}

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private mailerService: MailerService) {}

    async sendMail(user: User, subject: EmailSubjects, template: EmailTemplates, url: string) {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject,
                template: `./${template}`,
                context: { name: user.name, url }
            });
            this.logger.log(`Email sent to ${user.email} with subject: ${subject}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${user.email}: ${error.message}`);
        }
    }

    async sendUserConfirmationMail(user: User, token: string) {
        const url = `${process.env.API_URL}/api/auth/confirm?token=${token}`;
        await this.sendMail(user, EmailSubjects.CONFIRMATION, EmailTemplates.CONFIRMATION, url);
    }

    async sendResetPasswordMail(user: User, resetPasswordToken: string) {
        const url = `${process.env.CLIENT_URL}/reset-password?token=${resetPasswordToken}`;
        await this.sendMail(user, EmailSubjects.PASSWORD_RESTORE, EmailTemplates.PASSWORD_RESTORE, url);
    }
}
