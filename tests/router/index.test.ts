import {Express} from 'express';
import request from 'supertest';
import createApp from '../../src/server';

let app: Express;

beforeAll(async () => {
  app = await createApp(true);
});

describe('General server properties', () => {
  it('should respond json on 404', async () => {
    const resp = await request(app).get('/foo/bar');
    expect(resp.status).toEqual(404);
    expect(resp.body).toHaveProperty('success');
    expect(resp.body.success).toEqual(false);
  });
});

describe('GET /', () => {
  it('should say hi', async () => {
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('Hello world!!');
  });
});
