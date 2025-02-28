import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { OAuth2Client } from 'google-auth-library';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
        const oauth2Client = new OAuth2Client(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_SECRET,
          REDIRECT_URI,
        );
        oauth2Client.setCredentials({
          refresh_token: process.env.REFRESH_TOKEN,
        });
        const { token } = await oauth2Client.getAccessToken();
        return {
          transport: {
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: 'yju.intl@gmail.com',
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_SECRET,
              refreshToken: process.env.REFRESH_TOKEN,
              accessToken: token,
            },
          },
        };
      },
    }),
  ],

  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
