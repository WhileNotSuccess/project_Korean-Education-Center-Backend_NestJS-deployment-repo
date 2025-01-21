import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy,Profile } from "passport-google-oauth20";
import { UsersService } from "src/users/users.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService:UsersService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile):Promise<googleUser> {
    let user:googleUser = await this.usersService.findOneByGoogleId(profile.id)
    if(!user){
        const maybe = await this.usersService.findOneByEmail(profile.emails[0].value)
        if(maybe){
          return {...maybe, emailExistsButGoogleIdIsNotExists:profile.id}
        }
        const date = new Date()
        const newUser = await this.usersService.create({
            name:profile.displayName,
            email:profile.emails[0].value,
            emailVerifiedAt:profile.emails[0].verified ? date : null,
            googleId:profile.id
        })
        user = {...newUser,newUser:true}
    }
    return user
  }
}
