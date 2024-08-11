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
import { ActionRepository } from '../action/repositories/action.repository';
import { Action } from '../action/entities/action.entity';
import { EmailService } from 'src/infrastructure/mailer/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, Permission, Action])],
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
    ActionRepository,
    EmailService,
  ],
})
export class RoleModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.seed();
  }
}
