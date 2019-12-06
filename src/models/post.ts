import {ObjectId} from 'bson';
import mongoose from 'mongoose';

export interface Post extends mongoose.TimestampedDocument {
  author: ObjectId;
  board: ObjectId;
  content: string;
  title: string;
}

const schema = new mongoose.Schema({
  author: {
    ref: 'User',
    required: true,
    type: ObjectId
  },
  board: {
    ref: 'Board',
    required: true,
    type: ObjectId
  },
  content: {
    default: '',
    type: String
  },
  title: {
    required: true,
    type: String
  }
}, {timestamps: true});

export const PostModel = mongoose.model<Post>('Post', schema);
