import {ObjectId} from 'bson';

import {Board, BoardModel} from '../models/board';
import {Post, PostModel} from '../models/post';

// Common error literals
export const NAME_EXISTS = 'ENAME_EXISTS';
export const NAME_INVALID = 'ENAME_INVALID';
export const BOARD_NEXIST = 'EBOARD_NO_EXIST';
export const POST_NEXIST = 'EPOST_NO_EXIST';

// Hard-coded literals
const INVALID_BOARD_KEYS = ['admin'];
export const BOARD_KEY_REGEX = /^[0-9a-zA-Z\-]+$/;

/**
 * @description Create a new board.
 * @param key Key of board. This will be used as an route parameter,
 * and should match the regex `BOARD_KEY_REGEX`.
 * @param visibleName Visible name. This will be shown to the end user.
 * @throws `NAME_EXISTS`, `NAME_INVALID`
 * @returns Created board object
 */
export async function createBoard(key: string, visibleName: string): Promise<Board> {
  try {
    key = key.toLowerCase().trim();
    // Reject invalid keys
    if (!(BOARD_KEY_REGEX.test(key)) || (key in INVALID_BOARD_KEYS)) {
      throw NAME_INVALID;
    }
    // Check for duplicates
    const hasDuplicate = (await BoardModel.findOne({key})) !== null;
    if (hasDuplicate) {
      throw NAME_EXISTS;
    }
    return await new BoardModel({key, visibleName}).save();
  } catch (err) {
    throw err;
  }
}

/**
 * @description Rename a board. This only renames the visible name.
 * Keys are immutable by design!
 * @param key Key of board to rename
 * @param newVisibleName New visible name
 * @throws `BOARD_NEXIST`
 * @returns Created board object
 */
export async function renameBoard(key: string, newVisibleName: string): Promise<Board> {
  try {
    const board = await BoardModel.findOne({key})
      .select('-posts');
    if (board === null) {
      throw BOARD_NEXIST;
    }
    board.visibleName = newVisibleName;
    return await board.save();
  } catch (err) {
    throw err;
  }
}

/**
 * @description List board posts with the board metadata.
 * Posts will be sorted by time, descending order.
 * @param key Key of board
 * @param page Page for posts
 * @param postsPerPage Posts per page
 * @throws `BOARD_NEXIST`
 */
export async function listBoard(key: string, page: number = 1, postsPerPage: number = 20) {
  try {
    const board = await BoardModel.findOne({key})
    .populate({
      options: {
        limit: postsPerPage,
        // TODO: offset has a performance drop
        offset: postsPerPage * (page - 1),
        sort: {createdAt: -1}
      },
      path: 'posts',
      select: 'title author createdAt'
    });
    if (board === null) {
      throw BOARD_NEXIST;
    }
    return board;
  } catch (err) {
    throw err;
  }
}

/**
 * @description Get permissions information for a board
 * @param key Board key to query
 * @throws `BOARD_NEXIST`
 * @returns Permissions info object
 */
export async function getBoardPermissions(key: string) {
  try {
    const board = await BoardModel.findOne({key}).select('permissions');
    if (board === null) {
      throw BOARD_NEXIST;
    }
    return board.permissions;
  } catch (err) {
    throw err;
  }
}

/**
 * @description Create a new post
 * @param author Reference ObjectId of author
 * @param board Key of board
 * @param content Content html string
 * @param title Title html string
 * @throws `BOARD_NEXIST`
 */
export async function createPost(author: ObjectId, board: string, content: string, title: string) {
  try {
    const boardObj = await BoardModel.findOne({key: board}).select('_id');
    if (!boardObj) {
      throw BOARD_NEXIST;
    }
    return await new PostModel({
      author,
      board: boardObj._id,
      content,
      title
    }).save();
  } catch (err) {
    throw err;
  }
}

/**
 * @description Edit post
 * @param id ObjectId of post
 * @param newContent New content html string
 * @param newTitle New title html string
 * @throws `POST_NEXIST`
 * @returns Edited post object
 */
export async function editPost(id: ObjectId, edit: {
  board?: ObjectId;
  content?: string;
  title?: string;
}) {
  try {
    const post = await PostModel.findById(id);
    if (post === null) {
      throw POST_NEXIST;
    }
    post.board = edit.board ?? post.board;
    post.content = edit.content ?? post.content;
    post.title = edit.title ?? post.title;
    return await post.save();
  } catch (err) {
    throw err;
  }
}

/**
 * @description Delete a post
 * @param id ObjectId of post
 * @throws `POST_NEXIST`
 */
export async function deletePost(id: ObjectId): Promise<void> {
  try {
    if (await PostModel.findByIdAndDelete(id)) {
      throw POST_NEXIST;
    } else {
      return;
    }
  } catch (err) {
    throw err;
  }
}

/**
 * @description Get posts
 * @param query Post options to query
 * @param page Offset page
 * @param postPerPage Maximum number of posts to include
 */
export async function getPosts(query: Partial<Post>, page: number = 1, postPerPage: number = 20) {
  try {
    return await PostModel.find(query)
      .sort({createdAt: -1})
      .skip(postPerPage * (page - 1))
      .limit(postPerPage);
  } catch (err) {
    throw err;
  }
}

/**
 * @description Retrieve post by ObjectId.
 * @param id ObjectId of post
 * @returns `undefined` if post does not exist, Post object otherwise
 */
export async function getPostById(id: ObjectId): Promise<Post | undefined> {
  try {
    return await PostModel.findById(id) ?? undefined;
  } catch (err) {
    throw err;
  }
}
