import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: User, token: string) {
        const url = `${process.env.API_URL}/api/auth/confirm?token=${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: '[Web-Shop] Confirm your email',
            template: './confirmation',
            context: {
                name: user.name,
                url
            }
        })
    }
}
