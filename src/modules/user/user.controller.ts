import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Permissions } from '../../common/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('change-role/:id')
  @Permissions(PermissionEnum.UpdateRole)
  changeRole(@Param('id') id: string, @Body() data: ChangeRoleDto) {
    return this.userService.changeRole(id, data);
  }

  @Get()
  @Permissions(PermissionEnum.ViewUser)
  findAll(params) {
    return this.userService.findAll({
      ...params,
      relations: ['role', 'role.permissions'],
    });
  }

  @Get(':id')
  @Permissions(PermissionEnum.ViewUser)
  findOne(@Param('id') id: string) {
    return this.userService.findOne({
      where: { id: +id },
      relations: ['role', 'role.permissions'],
    });
  }

  @Patch(':id')
  @Permissions(PermissionEnum.UpdateUser)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Permissions(PermissionEnum.UpdateUser)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
