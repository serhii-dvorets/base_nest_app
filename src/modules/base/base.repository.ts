import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseRepository<T> {
  private readonly repository: Repository<T>;

  constructor(private readonly entityRepository: Repository<T>) {
    this.repository = entityRepository;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);

    return await this.repository.save(entity);
  }

  async findOne(options: FindOneOptions<T>): Promise<T | undefined> {
    return await this.repository.findOne(options);
  }

  async findAll(options: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async update(id: number, data: QueryDeepPartialEntity<T>): Promise<void> {
    await this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async save(data: DeepPartial<T>): Promise<void> {
    await this.repository.save(data);
  }
}
