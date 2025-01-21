import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy,Profile } from "passport-google-oauth20";
import { UsersService } from "src/users/users.service";

@Injectable()
export class GoogleLinkStrategy extends PassportStrategy(Strategy,'googleLink') {
  constructor(
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_LINK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    
    return profile.id
  }
}
