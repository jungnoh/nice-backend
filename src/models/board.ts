import {ObjectId} from 'bson';
import mongoose from 'mongoose';

export interface Board extends mongoose.TimestampedDocument {
  name: string;
  posts: ObjectId[];
}

const schema = new mongoose.Schema({
  name: {
    type: String
  },
  posts: [{
    type: String,
    ref: 'Post'
  }]
}, {timestamps: true});

export const BoardModel = mongoose.model<Board>('Board', schema);
