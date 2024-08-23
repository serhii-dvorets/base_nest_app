import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permissions } from '../../common/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Permissions(PermissionEnum.UpdateRole)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @Permissions(PermissionEnum.ViewRole)
  findAll(params) {
    return this.roleService.findAll(params);
  }

  @Get(':id')
  @Permissions(PermissionEnum.ViewRole)
  findOne(@Param('id') id: string) {
    return this.roleService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  @Permissions(PermissionEnum.UpdateRole)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions(PermissionEnum.UpdateRole)
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
