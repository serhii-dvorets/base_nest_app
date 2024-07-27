import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './repositories/role.repository';
import { FindManyOptions, FindOneOptions } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}
  create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.create(createRoleDto);
  }

  findAll(params: FindManyOptions) {
    return this.roleRepository.findAll(params);
  }

  findOne(params: FindOneOptions) {
    return this.roleRepository.findOne(params);
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.update(id, updateRoleDto);
  }

  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
