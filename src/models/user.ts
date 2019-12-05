import mongoose from 'mongoose';

export interface User extends mongoose.Document {
  email: string;
  isSuperuser: boolean;
  password: string;
  username: string;
}

const schema = new mongoose.Schema({
  email: {
    type: String
  },
  isSuperuser: {
    default: false,
    type: Boolean
  },
  password: {
    type: String
  },
  username: {
    type: String
  }
});

export const UserModel = mongoose.model<User>('User', schema);
