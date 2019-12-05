import {User, UserModel} from '../models/user';
import * as Password from '../utils/password';

/**
 * @description Create a user, without profile info
 * @param email Email address
 * @param username Username
 * @param password Plaintext password
 */
export async function createUser(email: string, username: string, password: string): Promise<User> {
  try {
    return await UserModel.create({
      email,
      password: await Password.hash(password),
      username
    });
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
    const user = await UserModel.findOne({username});
    if (user === null) {
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
    return await UserModel.findOne({username}) ?? undefined;
  } catch (err) {
    throw err;
  }
}
