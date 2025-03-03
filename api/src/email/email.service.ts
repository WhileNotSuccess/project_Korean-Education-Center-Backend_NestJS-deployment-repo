import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { signUpEmailText } from 'src/common/signUpEmailText';
import { MailerService } from '@nestjs-modules/mailer';
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendSignUpEmail(
    email: string,
    signUpVerifyToken: string,
    language: string,
  ) {
    const url = `${process.env.BACKEND_URL}/auth/email-verify?signupVerifyToken=${signUpVerifyToken}`;
    const emailText = signUpEmailText(language, url);

    return await this.mailerService.sendMail({
      to: email,
      subject: emailText.subject,
      html: emailText.html,
    });
  }
}
