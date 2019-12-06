import MongoStore from 'connect-mongo';
import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';
import mongoose from 'mongoose';
import nconf from 'nconf';
import passport from 'passport';
import router from './routes';
import {createKey} from './utils/crypto';

import * as PassportStrategy from './utils/passport';

interface MongoSettings {
    url: string;
    user?: string;
    pass?: string;
}

// TODO: Find a better name
async function setup(isDev: boolean) {
  const settingsPath = `${__dirname}/../config/config.${isDev ? 'dev' : 'prod'}.json`;
  nconf.file(settingsPath);
  try {
    if (!nconf.get('sessionSecret')) {
      nconf.set('sessionSecret', await createKey());
    }
    if (!nconf.get('mongodb')) {
      throw new Error('MongoDB connection config is not set');
    }
    const mongoConfig = nconf.get('mongodb') as MongoSettings;
    const mongooseConfig: mongoose.ConnectionOptions = {
      useCreateIndex: true,
      useFindAndModify: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    if (mongoConfig.user !== undefined) {
      mongooseConfig.user = mongoConfig.user;
      mongooseConfig.pass = mongoConfig.pass;
    }
    mongoose.connect(mongoConfig.url, mongooseConfig);
    // Save config
    nconf.save(() => null);
  } catch (err) {
    throw err;
  }
}

export default async function createApp(isDev: boolean = false) {
  // Set configs
  await setup(isDev);
  const app = express();
  // Express session
  app.use(expressSession({
    cookie: {
      httpOnly: false, // Client-side XHR will be used
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    },
    resave: false,
    saveUninitialized: false,
    secret: nconf.get('sessionSecret'),
    store: new (MongoStore(expressSession))({
      mongooseConnection: mongoose.connection
    })
  }));

  app.use(helmet());
  // Parsers
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  // Passport
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(PassportStrategy.localStrategy);
  passport.serializeUser(PassportStrategy.serialize);
  passport.deserializeUser(PassportStrategy.deserialize);
  app.use((req, res, next) => {
    req.currentUser = (req.user as any);
    next();
  });
  // Routes
  app.use(router);

  return app;
}
