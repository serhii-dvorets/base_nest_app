import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/modules/base/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from '../entities/action.entity';

@Injectable()
export class ActionRepository extends BaseRepository<Action> {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
  ) {
    super(actionRepository);
  }
}
