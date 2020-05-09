import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OperationsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const operationNames = this.reflector.get<string[]>(
      'operations',
      context.getHandler()
    );
    if (!operationNames) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.operations || user.operations.lengh === 0) {
      return false;
    } else {      
      const userOperations = user.operations.filter((operation) => operation === operationNames[0]);      
      if (userOperations && userOperations.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }
}
