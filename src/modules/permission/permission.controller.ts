import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permissions } from '../../common/decorators/permission.decorator';
import { PermissionEnum } from './enums/permission.enum';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Permissions(PermissionEnum.UpdatePermission)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @Permissions(PermissionEnum.ViewPermission)
  findAll(params) {
    return this.permissionService.findAll(params);
  }

  @Get(':id')
  @Permissions(PermissionEnum.ViewPermission)
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne({ where: { id: +id } });
  }

  @Patch(':id')
  @Permissions(PermissionEnum.UpdatePermission)
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @Permissions(PermissionEnum.UpdatePermission)
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
