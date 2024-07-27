import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'dev',
  Production = 'prod',
}

class EnvironmentVariables {
  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;

  @IsString()
  PROJECT_NAME: string;

  @IsString()
  SESSION_SECRET: string;

  @IsNumber()
  SESSION_EXPIRES: number;

  @IsString()
  PASSWORD_SALT: string;

  @IsNumber()
  PASSWORD_HASH_LENGTH: number;

  @IsString()
  SUPERADMIN_USERNAME: string;

  @IsString()
  SUPERADMIN_EMAIL: string;

  @IsString()
  SUPERADMIN_PASSWORD: string;
}

export function validateConfig(configuration: Record<string, unknown>) {
  const configClass = plainToClass(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(configClass, { skipMissingProperties: false });

  for (const err of errors) {
    Object.values(err.constraints).map((str) => {
      console.log(str);
      console.log('-----------------------');
    });
  }

  if (errors.length) {
    throw new Error('Error during the environment variables reading');
  }

  return configClass;
}
