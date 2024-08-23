import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum ActionTypeEnum {
  emailCofirmation = 'emailConfirmation',
  passwordRecovery = 'passwordRecovery',
}

@Entity()
export class Action {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ActionTypeEnum,
  })
  type: ActionTypeEnum;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
