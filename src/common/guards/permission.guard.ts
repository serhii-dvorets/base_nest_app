import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = await this.userRepository.findOne({
      where: { id: request?.session?.user?.id },
      relations: ['role', 'role.permissions'],
    });

    if (!user) {
      return false;
    }

    const userHasPermission = user.role.permissions.some((permission) =>
      requiredPermissions.includes(permission.name),
    );

    if (!userHasPermission) {
      return false;
    }

    return true;
  }
}
