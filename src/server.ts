import express from 'express';
import {createConnection} from 'typeorm';
import router from './routes';

export default async function createApp(isDev: boolean = false) {
  const conn = await createConnection();
  const app = express();
  app.use(router);
  return app;
}
