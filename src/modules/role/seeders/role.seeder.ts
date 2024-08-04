import { Injectable } from '@nestjs/common';
import { PermissionService } from 'src/modules/permission/permission.service';
import { RoleService } from '../role.service';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { PermissionEnum } from 'src/modules/permission/enums/permission.enum';

@Injectable()
export class SeedService {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async seed() {
    const allPermissions = [
      PermissionEnum.ViewPermission,
      PermissionEnum.UpdatePermission,
      PermissionEnum.ViewRole,
      PermissionEnum.UpdateRole,
      PermissionEnum.ViewUser,
      PermissionEnum.UpdateUser,
      PermissionEnum.ViewProduct,
      PermissionEnum.UpdateProduct,
    ];

    const adminPermissions = [
      PermissionEnum.ViewUser,
      PermissionEnum.UpdateUser,
      PermissionEnum.ViewProduct,
      PermissionEnum.UpdateProduct,
    ];

    const userPermissions = [
      PermissionEnum.ViewUser,
      PermissionEnum.UpdateUser,
      PermissionEnum.ViewProduct,
    ];

    for (const name of allPermissions) {
      const permission = await this.permissionService.findOne({
        where: { name },
      });

      if (!permission) {
        await this.permissionService.create({ name });
      }
    }

    const initialRoles = [
      {
        name: 'superadmin',
        description: 'Super admin role',
        permissions: allPermissions,
      },
      {
        name: 'admin',
        description: 'Admin role',
        permissions: adminPermissions,
      },
      {
        name: 'user',
        description: 'User role',
        permissions: userPermissions,
      },
    ];

    for (const roleData of initialRoles) {
      const existingRole = await this.roleService.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        let permissions: Permission[];

        if (roleData.permissions.length) {
          permissions = await this.permissionService.findAll({
            where: roleData.permissions.map((name) => ({ name })),
          });
        }

        await this.roleService.create({
          name: roleData.name,
          description: roleData.description,
          permissions: permissions || [],
        });
      }
    }

    const superadminRole = await this.roleService.findOne({
      where: { name: 'superadmin' },
    });

    if (superadminRole) {
      const { username, email, password } = this.configService.get(
        'app.superAdminParams',
      );

      const superadmin = await this.userService.findOne({ where: { email } });

      if (!superadmin) {
        const hash = this.authService.hashPassword(password);

        const superAdmin = this.userRepository.create({
          name: username,
          email,
          password: hash,
          role: superadminRole,
        });

        return this.userRepository.save(superAdmin);
      }
    }
  }
}
