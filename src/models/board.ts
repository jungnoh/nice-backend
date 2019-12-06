import {ObjectId} from 'bson';
import mongoose from 'mongoose';

export interface Board extends mongoose.TimestampedDocument {
  name: string;
  posts: ObjectId[];
}

const schema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    unique: true
  },
  posts: [{
    ref: 'Post',
    type: String
  }]
}, {timestamps: true});

export const BoardModel = mongoose.model<Board>('Board', schema);
