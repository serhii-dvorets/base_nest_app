import { ISession } from 'connect-typeorm';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sessions')
export class Session implements ISession {
  @Index()
  @Column('bigint')
  expiredAt: number;

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  json: string;

  @DeleteDateColumn()
  destroyedAt?: Date;
}
