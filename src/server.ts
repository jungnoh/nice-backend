import { TypeormStore } from 'connect-typeorm/out';
import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';
import passport from 'passport';
import {createConnection} from 'typeorm';
import Session from './models/session';
import router from './routes';

import * as PassportStrategy from './utils/passport';

export default async function createApp(isDev: boolean = false) {
  const dbConn = await createConnection();
  const app = express();

  const sessionRepo = dbConn.getRepository(Session);
  app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'asdf', // TODO: Use a secure key
    store: new TypeormStore({
      cleanupLimit: 2,
      limitSubquery: false,
      ttl: 86400
    }).connect(sessionRepo)
  }));

  app.use(helmet());
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
