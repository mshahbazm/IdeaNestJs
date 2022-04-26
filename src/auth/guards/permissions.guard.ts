import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector){}

  canActivate(
    context: ExecutionContext,
  ): boolean  {
    const [req] = context.getArgs();
    const userPermissions = req?.user?.permissions || [];
    const requiredPermissions = this.reflector.get('permissions', context.getHandler()) || [];
    const hasAllPermissions = requiredPermissions.every(permision => userPermissions.includes(permision))
    if(requiredPermissions.length === 0 || hasAllPermissions){
      return true;
    }
    throw new ForbiddenException('Insufficient permissions');
  }
}
