import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 8000,
  nodeEnv: process.env.NODE_ENV,
  passwordHashParams: {
    salt: process.env.PASSWORD_SALT,
    hashLength: parseInt(process.env.PASSWORD_HASH_LENGTH, 10),
  },
  superAdminParams: {
    username: process.env.SUPERADMIN_USERNAME,
    email: process.env.SUPERADMIN_EMAIL,
    password: process.env.SUPERADMIN_PASSWORD,
  },
}));
