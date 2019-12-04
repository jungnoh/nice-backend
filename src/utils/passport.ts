import {Strategy as LocalStrategy} from 'passport-local';
import User from '../models/user';
import * as UserService from '../services/user';

interface SerializedUser {
  email: string;
  isSuperuser: boolean;
  username: string;
}

/**
 * @description Local authentication strategy
 */
export const localStrategy = new LocalStrategy({
  passReqToCallback: true,
  passwordField: 'password',
  usernameField: 'username'
}, async (req, username, password, done) => {
  try {
    const user = await UserService.authenticate(username, password);
    if (user === undefined) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  } catch (err) {
    return done(err);
  }
});

/**
 * @description Serializes a `User` object to a `SerializedUser`
 * @param user `User` model object
 * @param done Callback function
 */
export const serialize = (user: User, done: any) => {
  const serialized: SerializedUser = {
    email: user.email,
    isSuperuser: user.isSuperuser,
    username: user.username
  };
  done(null, serialized);
};

/**
 * @description Deserializes a `SerializedUser` to a `User` object
 * @param user `SerializedUser` seralized user
 * @param done Callback function
 */
export const deserialize = (user: SerializedUser, done: any) => {
  UserService.getByUsername(user.username).then((userObj) => {
    if (userObj === undefined) {
      done('Cannot find user', undefined);
    } else {
      done(null, userObj);
    }
  });
};
