import { Injectable, NotFoundException } from '@nestjs/common';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RoleRepository } from '../role/repositories/role.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}
  async changeRole(id, data: ChangeRoleDto) {
    const user = await this.userRepository.findOne({
      where: { id: +id },
    });

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const role = await this.roleRepository.findOne({
      where: { name: data.role },
    });

    if (!role) {
      throw new NotFoundException('ROlE_NOT_FOUND');
    }

    user.role = role;

    await this.userRepository.save(user);

    return user;
  }

  findAll(params: FindManyOptions) {
    return this.userRepository.findAll(params);
  }

  findOne(params: FindOneOptions) {
    return this.userRepository.findOne(params);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
