import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/modules/base/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    super(permissionRepository);
  }
}
