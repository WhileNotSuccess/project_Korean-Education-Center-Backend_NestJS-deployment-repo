// google-link.guard.ts
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class GoogleLinkAuthGuard extends NestAuthGuard('googleLink') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = (await super.canActivate(context)) as boolean;

    const request = context.switchToHttp().getRequest();
    const user = request.user; // GoogleLink 가드가 반환하는 user 정보
    request.customData = { ...request.customData, googleUser: user };

    return canActivate;
  }
}
