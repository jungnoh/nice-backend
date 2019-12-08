import crypto from 'crypto';
import {Express} from 'express';
import request from 'supertest';
import createApp from '../../src/server';
import * as UserService from '../../src/services/user';

let app: Express;

const boardKey = 'test-' + crypto.randomBytes(8).toString('hex');
const adminID = 'test_' + crypto.randomBytes(8).toString('hex');
const userID = 'test_' + crypto.randomBytes(8).toString('hex');

beforeAll(async () => {
  app = await createApp(true);
  // Create test admin
  await UserService.createUser(`${adminID}@test.com`, adminID, 'asdf', true);
  await UserService.createUser(`${userID}@test.com`, userID, 'asdf', false);
});

describe('Board Administration', () => {
  let userAgent: request.SuperTest<request.Test>;
  let adminAgent: request.SuperTest<request.Test>;
  beforeAll(async () => {
    userAgent = request.agent(app);
    adminAgent = request.agent(app);
    await userAgent.post('/user/login').send({
      password: 'asdf',
      username: userID
    });
    await adminAgent.post('/user/login').send({
      password: 'asdf',
      username: adminID
    });
  });
  describe('Create board', () => {
    it('should 403 when accessed by non-superuser', async () => {
      const resp = await userAgent.post('/board/admin/board/create').send({
        key: 'foo',
        visibleName: 'bar'
      });
      expect(resp.status).toEqual(403);
    });
    it('should 400 on missing params', async () => {
      const resp = await adminAgent.post('/board/admin/board/create').send({
        key: 'foo@@@@//'
      });
      expect(resp.status).toEqual(400);
      expect(resp.body.success).toEqual(false);
    });
    it('should 400 on invalid tag', async () => {
      const resp = await adminAgent.post('/board/admin/board/create').send({
        key: 'foo@@@@//',
        visibleName: 'bar'
      });
      expect(resp.status).toEqual(400);
      expect(resp.body.success).toEqual(false);
    });
    it('should successfully create board', async () => {
      const resp = await adminAgent.post('/board/admin/board/create').send({
        key: boardKey,
        visibleName: 'test'
      });
      expect(resp.status).toEqual(200);
      expect(resp.body.success).toEqual(true);
    });
    it('should 400 if board key exists', async () => {
      const resp = await adminAgent.post('/board/admin/board/create').send({
        key: boardKey,
        visibleName: 'test'
      });
      expect(resp.status).toEqual(400);
      expect(resp.body.success).toEqual(false);
    });
  });
});
