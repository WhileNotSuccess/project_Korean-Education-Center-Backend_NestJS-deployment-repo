import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config';
import { signUpEmailText } from 'src/common/signUpEmailText';
interface EmailOptions {
  to:string;
  subject:string;
  html:string;
}

@Injectable()
export class EmailService {
  private transporter: Mail
  private backendUrl:string
  constructor(
    private readonly configService:ConfigService
  ){
    this.backendUrl = this.configService.get("BACKEND_URL")
    this.transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:this.configService.get("EMAIL_USER"),
        pass:this.configService.get("EMAIL_PASS"),
      }
    })
  }
  async sendSignUpEmail(email:string, signUpVerifyToken:string, language:string){
    const url = `${this.backendUrl}/auth/email-verify?signupVerifyToken=${signUpVerifyToken}`
    const emailText = signUpEmailText(language, url)
    const mailOptions: EmailOptions = {...emailText, to:email}
    return await this.transporter.sendMail(mailOptions)
  }
}
