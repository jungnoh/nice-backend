import mongoose from 'mongoose';

export interface User extends mongoose.Document {
  email: string;
  isSuperuser: boolean;
  password: string;
  username: string;
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
    required: true,
    type: String
  }
});

export const UserModel = mongoose.model<User>('User', schema);
