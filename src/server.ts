import express from 'express';
import passport from 'passport';
import {createConnection} from 'typeorm';
import router from './routes';

import cookieSession from 'cookie-session';
import * as PassportStrategy from './utils/passport';

export default async function createApp(isDev: boolean = false) {
  await createConnection();
  const app = express();

  app.use(cookieSession({
    keys: ['asdf'], // TODO: Use a secure key
    maxAge: 1000 * 60 * 60 * 24
  }));
  // Passport
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(PassportStrategy.localStrategy);
  passport.serializeUser(PassportStrategy.serialize);
  passport.deserializeUser(PassportStrategy.deserialize);
  // Routes
  app.use(router);

  return app;
}
