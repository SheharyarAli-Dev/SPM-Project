import {
  Injectable,
  ForbiddenException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user_id?: number }>();

    const headerValue = request.headers['x-user-id'];
    const rawUserId = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    const requesting_user_id = Number.parseInt(rawUserId ?? '', 10);

    if (!Number.isFinite(requesting_user_id)) {
      throw new ForbiddenException('x-user-id header is required');
    }

    request.user_id = requesting_user_id;
    return true;
  }
}
