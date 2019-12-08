// tslint:disable: no-console
import mongoose from 'mongoose';
import nconf from 'nconf';
import {UserModel} from './src/models/user';
import {hash} from './src/utils/password';

const username = 'admin';
const password = 'asdf';
const email = 'asdf@asdf.com';

const settingsPath = `${__dirname}/config/config.dev.json`;
nconf.file(settingsPath);
if (!nconf.get('mongodb')) {
  throw new Error('MongoDB connection config is not set');
}
const mongoConfig = nconf.get('mongodb');
const mongooseConfig: mongoose.ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
if (mongoConfig.user !== undefined) {
  mongooseConfig.user = mongoConfig.user;
  mongooseConfig.pass = mongoConfig.pass;
}
mongoose.connect(mongoConfig.url, mongooseConfig);

const task = async () => {
  await new UserModel({
    email,
    isSuperuser: true,
    password: await hash(password),
    username
  }).save();
};
task()
.then(() => console.log('Complete'))
.catch((err) => console.log(err));
