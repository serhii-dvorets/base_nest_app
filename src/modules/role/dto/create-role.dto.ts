import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Permission } from 'src/modules/permission/entities/permission.entity';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  permissions: Permission[];
}
