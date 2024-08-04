import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './repositories/role.repository';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { PermissionRepository } from '../permission/repositories/permission.repository';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}
  async create({ name, description, permissionIds }: CreateRoleDto) {
    const role = await this.roleRepository.create({
      name,
      description,
    });

    const permissions = await this.permissionRepository.findAll({
      where: { id: In(permissionIds.map((id: string) => +id)) },
    });

    role.permissions = permissions;

    await this.roleRepository.save(role);

    return role;
  }

  findAll(params: FindManyOptions) {
    return this.roleRepository.findAll(params);
  }

  findOne(params: FindOneOptions) {
    return this.roleRepository.findOne(params);
  }

  async update(id: number, { name, permissionIds }: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({ where: { id: +id } });

    if (!role) {
      throw new NotFoundException('ROLE_NOT_FOUND');
    }

    const permissions = await this.permissionRepository.findAll({
      where: { id: In(permissionIds.map((permission) => +permission)) },
    });

    role.permissions = permissions;
    if (name) role.name = name;

    await this.roleRepository.save(role);

    return role;
  }

  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
