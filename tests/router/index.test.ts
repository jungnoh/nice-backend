import {Express} from 'express';
import request from 'supertest';
import createApp from '../../src/server';

let app: Express;

beforeAll(async () => {
  app = await createApp(true);
});

describe('GET /', () => {
  it('should say hi', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('Hello world!!');
  });
});
