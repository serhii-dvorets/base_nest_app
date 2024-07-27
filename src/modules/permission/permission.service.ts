import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionRepository } from './repositories/permission.repository';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}
  create(createPermissionDto: CreatePermissionDto) {
    return this.permissionRepository.create(createPermissionDto);
  }

  findAll() {
    return this.permissionRepository.findAll({});
  }

  findOne(id: number) {
    return this.permissionRepository.findOne({ where: { id } });
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionRepository.update(id, updatePermissionDto);
  }

  remove(id: number) {
    return this.permissionRepository.delete(id);
  }
}
