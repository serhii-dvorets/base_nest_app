import { registerAs } from '@nestjs/config';

export default registerAs('session', () => ({
  name: `${process.env.PROJECT_NAME}.sid`,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'dev',
    sameSite: 'strict',
    maxAge: parseInt(process.env.SESSION_EXPIRES, 10),
  },
}));
