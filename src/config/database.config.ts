import { registerAs } from '@nestjs/config';

type ConnectingParams = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export default registerAs('database', () => {
  const testMode = process.env.NODE_ENV === 'test';

  let connectingParams: ConnectingParams;

  if (testMode) {
    connectingParams = {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: parseInt(process.env.TEST_DB_PORT, 10) || 3306,
      username: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_DATABASE,
    };
  } else {
    connectingParams = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    };
  }
  return {
    ...connectingParams,
    type: 'mysql',
    entities: [`${__dirname}/../modules/**/entities/*.entity{.ts,.js}`],
    synchronize: process.env.NODE_ENV === 'dev',
  };
});
