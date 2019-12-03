import {getManager} from 'typeorm';
import User from '../models/user';
import * as Password from '../utils/password';

const entityManager = getManager();

export async function createUser(email: string, username: string, password: string): Promise<User> {
  try {
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = await Password.hash(password);
    await entityManager.save(user);
    return user;
  } catch (err) {
    throw err;
  }
}

export async function authUser(username: string, password: string): Promise<boolean> {
  try {
    const user = await entityManager.findOne(User, {username});
    if (user === undefined) {
      return false;
    } else {
      return await Password.verify(user.password, password);
    }
  } catch (err) {
    throw err;
  }
}

export async function getByUsername(username: string): Promise<User | undefined> {
  try {
    return await entityManager.findOne(User, {username});
  } catch (err) {
    throw err;
  }
}
