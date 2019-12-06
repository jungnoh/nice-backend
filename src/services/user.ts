import {ObjectId} from 'bson';
import {User, UserModel} from '../models/user';
import * as Password from '../utils/password';

// Common error literals
export const EMAIL_EXISTS = 'EEMAIL_EXISTS';
export const USERNAME_EXISTS = 'EUSERNAME_EXISTS';

/**
 * @description Create a user, without profile info
 * @param email Email address
 * @param username Username
 * @param password Plaintext password
 * @throws `EMAIL_EXISTS`, `USERNAME_EXISTS`
 */
export async function createUser(email: string, username: string, password: string): Promise<User> {
  try {
    const existingUsers = await UserModel.find({
      $or: [
        {email},
        {username}
      ]
    });
    if (existingUsers.length > 0) {
      if (existingUsers[0].email === email) {
        throw EMAIL_EXISTS;
      } else {
        throw USERNAME_EXISTS;
      }
    }
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

/**
 * @description Find user by username.
 * This result should not be exposed as an API result, as it includes sensitive information
 * (eg. password hashes)
 * @param options Search options to query by
 * @returns User object if found, undefined otherwise
 */
export async function findOne(options: Partial<User>): Promise<User | undefined> {
  try {
    return await UserModel.findOne(options) ?? undefined;
  } catch (err) {
    throw err;
  }
}

/**
 * @description Find user, and retrieve profile. This removes sensitive information unlike `findOne`.
 * @param options Search options to query by
 * @returns User object if found, undefined otherwise
 */
export async function findOneProfile(options: Partial<User>): Promise<User | undefined> {
  try {
    return await UserModel
      .findOne(options)
      .select('-password')
      ?? undefined;
  } catch (err) {
    throw err;
  }
}

export async function update(id: ObjectId, data: Partial<User>): Promise<User | undefined> {
  try {
    return await UserModel.findByIdAndUpdate(id, data) ?? undefined;
  } catch (err) {
    throw err;
  }
}
