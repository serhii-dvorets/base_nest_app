import { Role } from 'src/modules/role/entities/role.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: false, default: false })
  emailConfirmed: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  confirmEmail() {
    this.emailConfirmed = true;
  }
}
