import {getManager} from 'typeorm';
import User from '../models/user';
import * as Password from '../utils/password';

/**
 * @description Create a user, without profile info
 * @param email Email address
 * @param username Username
 * @param password Plaintext password
 */
export async function createUser(email: string, username: string, password: string): Promise<User> {
  try {
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = await Password.hash(password);
    await getManager().save(user);
    return user;
  } catch (err) {
    throw err;
  }
}

/**
 * @description Authenticate a user with username, password credentials
 * @returns `undefined` if failed, corresponding User object if succeeded
 * @param username Username
 * @param password Plaintext password
 */
export async function authenticate(username: string, password: string): Promise<User | undefined> {
  try {
    const user = await getManager().findOne(User, {username});
    if (user === undefined) {
      return undefined;
    } else {
      const valid = await Password.verify(user.password, password);
      if (valid) {
        return user;
      } else {
        return undefined;
      }
    }
  } catch (err) {
    throw err;
  }
}

export async function getByUsername(username: string): Promise<User | undefined> {
  try {
    return await getManager().findOne(User, {username});
  } catch (err) {
    throw err;
  }
}
