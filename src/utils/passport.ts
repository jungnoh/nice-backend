import {Strategy as LocalStrategy} from 'passport-local';
import {User} from '../models/user';
import * as UserService from '../services/user';

/**
 * @description Local authentication strategy
 */
export const localStrategy = new LocalStrategy({
  passReqToCallback: true,
  passwordField: 'password',
  usernameField: 'username'
}, async (_, username, password, done) => {
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
  done(null, user._id);
};

/**
 * @description Deserializes a `SerializedUser` to a `User` object
 * @param user `SerializedUser` seralized user
 * @param done Callback function
 */
export const deserialize = (user: string, done: any) => {
  UserService.findOne({_id: user}).then((userObj) => {
    if (userObj === undefined) {
      done('Cannot find user', undefined);
    } else {
      done(null, userObj);
    }
  });
};
