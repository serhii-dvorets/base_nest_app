import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../user/repositories/user.repository';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleService } from '../role/role.service';
import { RoleRepository } from '../role/repositories/role.repository';
import { Role } from '../role/entities/role.entity';
import { PermissionRepository } from '../permission/repositories/permission.repository';
import { Permission } from '../permission/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    UserRepository,
    RoleService,
    RoleRepository,
    PermissionRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
