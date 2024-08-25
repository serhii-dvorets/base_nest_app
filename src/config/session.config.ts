import { registerAs } from '@nestjs/config';

export default registerAs('session', () => ({
  name: `${process.env.PROJECT_NAME}.sid`,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: !['dev', 'test'].includes(process.env.NODE_ENV),
    secure: !['dev', 'test'].includes(process.env.NODE_ENV),
    sameSite: 'strict',
    maxAge: parseInt(process.env.SESSION_EXPIRES, 10),
  },
}));
