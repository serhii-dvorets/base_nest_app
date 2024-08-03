import { Module, OnModuleInit } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { SeedService } from './seeders/role.seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { RoleRepository } from './repositories/role.repository';
import { PermissionService } from '../permission/permission.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { PermissionRepository } from '../permission/repositories/permission.repository';
import { UserRepository } from '../user/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, Permission])],
  controllers: [RoleController],
  providers: [
    RoleService,
    SeedService,
    RoleRepository,
    PermissionService,
    UserService,
    AuthService,
    PermissionRepository,
    UserRepository,
  ],
})
export class RoleModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.seed();
  }
}
