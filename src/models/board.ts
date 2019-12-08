import {ObjectId} from 'bson';
import mongoose from 'mongoose';

export enum AccessType {
  Anyone = 'anyone',
  Member = 'member',
  Superuser = 'superuser'
}

export interface Board extends mongoose.TimestampedDocument {
  key: string;
  permissions: {
    comment: AccessType;
    list: AccessType;
    read: AccessType;
    write: AccessType;
  };
  posts: ObjectId[];
  visibleName: string;
}

const schema = new mongoose.Schema({
  key: {
    index: true,
    required: true,
    type: String,
    unique: true
  },
  permissions: {
    comment: {default: AccessType.Member, type: AccessType},
    list: {default: AccessType.Member, type: AccessType},
    read: {default: AccessType.Member, type: AccessType},
    write: {default: AccessType.Member, type: AccessType}
  },
  posts: [{
    ref: 'Post',
    type: String
  }],
  visibleName: {
    required: true,
    type: String
  }
}, {timestamps: true});

export const BoardModel = mongoose.model<Board>('Board', schema);
