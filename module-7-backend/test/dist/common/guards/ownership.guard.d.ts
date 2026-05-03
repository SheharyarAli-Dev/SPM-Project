import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class OwnershipGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
