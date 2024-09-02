import { Injectable, NotFoundException } from '@nestjs/common';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RoleRepository } from '../role/repositories/role.repository';
import { showUserDto } from './dto/show-ser.dto';

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
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('ROLE_NOT_FOUND');
    }

    user.role = role;

    await this.userRepository.save(user);

    return showUserDto(user);
  }

  async findAll(params: FindManyOptions) {
    const users = await this.userRepository.findAll(params);

    if (users.length) {
      return users.map((user) => showUserDto(user));
    }
  }

  async findOne(params: FindOneOptions) {
    const user = await this.userRepository.findOne(params);

    if (user) {
      return showUserDto(user);
    }

    return null;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
