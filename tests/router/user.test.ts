import crypto from 'crypto';
import {Express} from 'express';
import request from 'supertest';
import createApp from '../../src/server';
import * as UserService from '../../src/services/user';

let app: Express;

const memberID = 'test_' + crypto.randomBytes(8).toString('hex');
const adminID = 'test_' + crypto.randomBytes(8).toString('hex');

beforeAll(async () => {
  app = await createApp(true);
  // Create test admin
  await UserService.createUser(`${adminID}@test.com`, adminID, 'asdf', true);
});

describe('Authorization', () => {
  describe('Sign up', () => {
    it('should 400 on missing input', async () => {
      const resp = await request(app).post('/user/signup').send({
        email: 'asdf@asdf.com',
        username: 'foo'
      });
      expect(resp.status).toEqual(400);
      expect(resp.body.success).toBe(false);
      expect(resp.body).toHaveProperty('reason');
    });
    it('should 400 on invalid email', async () => {
      const resp = await request(app).post('/user/signup').send({
        email: 'asdf',
        password: 'bar',
        username: 'foo'
      });
      expect(resp.status).toEqual(400);
      expect(resp.body.success).toBe(false);
      expect(resp.body).toHaveProperty('reason');
    });
    it('should properly sign up', async () => {
      const resp = await request(app).post('/user/signup').send({
        email: `${memberID}@test.com`,
        password: 'asdf',
        username: memberID
      });
      expect(resp.status).toEqual(200);
      expect(resp.body.success).toBe(true);
    });
    it('should 409 if email or username exists', async () => {
      const resp = await request(app).post('/user/signup').send({
        email: `${memberID}@test.com`,
        password: 'asdf',
        username: memberID
      });
      expect(resp.status).toEqual(409);
      expect(resp.body.success).toBe(false);
    });
  });
  describe('GET /user/me', () => {
    it('should respond nicely when not logged in', async () => {
      const resp = await request(app).get('/user/me');
      expect(resp.status).toEqual(200);
      expect(resp.body.success).toBe(true);
      expect(resp.body.loggedIn).toBe(false);
      expect(resp.body.me).toStrictEqual({});
    });
  });
  describe('Login related', () => {
    it('should 400 on bad input', async () => {
      const resp = await request(app).post('/user/login').send({
        username: 'foo'
      });
      expect(resp.status).toEqual(400);
      expect(resp.body).toHaveProperty('success');
      expect(resp.body.success).toBe(false);
    });
    it('should 401 on bad credentials', async () => {
      const resp = await request(app).post('/user/login').send({
        password: 'bar',
        username: 'foo'
      });
      expect(resp.status).toEqual(401);
      expect(resp.body).toHaveProperty('success');
      expect(resp.body.success).toBe(false);
    });
    it('should log in properly', async () => {
      const agent = request.agent(app);
      const resp = await agent.post('/user/login').send({
        password: 'asdf',
        username: memberID
      });
      expect(resp.status).toEqual(200);
      expect(resp.body).toHaveProperty('success');
      expect(resp.body.success).toBe(true);

      const meResp = await agent.get('/user/me');
      expect(meResp.status).toBe(200);
      expect(meResp.body.loggedIn).toBe(true);
      expect(meResp.body.me).toHaveProperty('username');
      expect(meResp.body.me.username).toEqual(memberID);
    });
    it('should log out properly', async () => {
      const agent = request.agent(app);
      await agent.post('/user/login').send({
        password: 'asdf',
        username: memberID
      });
      const meResp = await agent.get('/user/me');
      expect(meResp.status).toBe(200);
      expect(meResp.body.loggedIn).toBe(true);
      expect(meResp.body.me).toHaveProperty('username');
      expect(meResp.body.me.username).toEqual(memberID);

      await agent.get('/user/logout');
      const afterMeResp = await agent.get('/user/me');
      expect(afterMeResp.status).toBe(200);
      expect(afterMeResp.body.loggedIn).toBe(false);
    });
  });
});
