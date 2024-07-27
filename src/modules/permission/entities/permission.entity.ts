import { Role } from 'src/modules/role/entities/role.entity';
import { Column, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  @JoinTable()
  roles: Role[];
}
