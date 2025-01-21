import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request) => { 
        let token = null;
        if (request && request.cookies) {  
          token = request.cookies['access_token']; 
        }
        return token; 
      }]),
      ignoreExpiration: false,
      secretOrKey:process.env.JWT_SECRET,
    })
  }
  
  async validate(payload: any) {
    return {
        id:payload.sub,
        name:payload.username,
        email:payload.email
    }
  }
}