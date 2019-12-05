import nconf from 'nconf';
import MongoStore from 'connect-mongo';
import express from 'express';
import expressSession from 'express-session';
import helmet from 'helmet';
import mongoose from 'mongoose';
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
  // Set config dir
  await setup(isDev);

  const app = express();
  app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'asdf',
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
  // Routes
  app.use(router);

  return app;
}
