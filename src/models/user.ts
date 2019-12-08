import mongoose from 'mongoose';

/**
 * @description User profile model description.
 * This will not be used directly as a schema, but when a user object is exposed to the end API,
 * the object must NOT contain members that are not in `UserProfile`.
 */
export interface UserProfile {
  email: string;
  isSuperuser: boolean;
  username: string;
}

/**
 * @description User model.
 * @see `UserProfile`
 */
export interface User extends UserProfile, mongoose.Document {
  password: string;
}

const schema = new mongoose.Schema({
  email: {
    required: true,
    type: String
  },
  isSuperuser: {
    default: false,
    required: true,
    type: Boolean
  },
  password: {
    required: true,
    type: String
  },
  username: {
    index: true,
    required: true,
    type: String,
    unique: true
  }
});

export const UserModel = mongoose.model<User>('User', schema);
