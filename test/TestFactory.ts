import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { RoleEnum } from 'src/modules/role/enums/role.enum';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

type MakeRequestParams = {
  method: 'get' | 'post' | 'patch' | 'delete';
  path: string;
  payload: any;
};

class TestFactory {
  app: INestApplication;
  configService: ConfigService;
  dataSource: DataSource;
  cookie: string;

  async init() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    this.configService = moduleFixture.get<ConfigService>(ConfigService);
    this.dataSource = moduleFixture.get<DataSource>(getDataSourceToken());

    await this.app.init();
  }

  async getSession(role: RoleEnum) {
    if (role === RoleEnum.SuperAdmin) {
      const { email, password } = this.configService.get(
        'app.superAdminParams',
      );

      const request = await this.makeRequest({
        method: 'post',
        path: '/auth/login',
        payload: { email, password },
      });

      this.cookie = request.headers['set-cookie'];
    }
  }

  async clearAll() {
    const entities = await this.dataSource.entityMetadatas.map(
      (entity) => `${entity.tableName}`,
    );

    await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');

    for (const entity of entities) {
      await this.dataSource.query(`TRUNCATE TABLE ${entity};`);
    }

    await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
  }

  async closeApp() {
    await this.dataSource.destroy();
    await this.app.close();
  }

  async makeRequest({ method, path, payload }: MakeRequestParams) {
    return request(this.app.getHttpServer())
      [method](path)
      .set('Cookie', this.cookie || '')
      .send(payload);
  }
}

export default TestFactory;
