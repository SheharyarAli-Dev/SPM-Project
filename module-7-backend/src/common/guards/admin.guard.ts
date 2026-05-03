import {
  Injectable,
  ForbiddenException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const headerValue = request.headers['x-admin-key'];
    const adminKey = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    const expectedKey = this.configService.get<string>('ADMIN_KEY');

    if (!expectedKey || !adminKey || adminKey !== expectedKey) {
      throw new ForbiddenException('Invalid or missing admin key');
    }

    return true;
  }
}
