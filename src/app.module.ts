import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AppConfig,
  DatabaseConfig,
  MailerConfig,
  SessionConfig,
} from './config';
import { validateConfig } from './common/validation/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { NestSessionOptions, SessionModule } from 'nestjs-session';
import { DataSource } from 'typeorm';
import { TypeormStore } from 'connect-typeorm';
import { Session } from './modules/session/entities/session.entity';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateConfig,
      isGlobal: true,
      load: [AppConfig, DatabaseConfig, SessionConfig, MailerConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    SessionModule.forRootAsync({
      inject: [ConfigService, DataSource],
      useFactory: (
        configService: ConfigService,
        dataSource: DataSource,
      ): NestSessionOptions => ({
        session: {
          ...configService.get('session'),
          store: new TypeormStore({
            cleanupLimit: 2,
            limitSubquery: false,
          }).connect(dataSource.getRepository(Session)),
        },
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('mailer'),
      }),
    }),
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
