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
    type: ObjectId
  },
  board: {
    ref: 'Board',
    type: ObjectId
  },
  content: {
    type: String
  },
  title: {
    type: String
  }
}, {timestamps: true});

export const PostModel = mongoose.model<Post>('Post', schema);
