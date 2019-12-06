import {ObjectId} from 'bson';
import DOMPurify from 'dompurify';
import {Request, Response} from 'express';
import {AccessType} from '../models/board';
import * as BoardService from '../services/board';

function checkUserLevel(req: Request, level: AccessType): boolean {
  switch(level) {
    case AccessType.Superuser:
      return req.currentUser?.isSuperuser ?? false;
    case AccessType.Member:
      return req.currentUser ? true : false;
    case AccessType.Anyone:
      return true;
    default:
      return false;
  }
}

/**
 * @description Controller for `POST /admin/board/create`
 */
export async function createBoard(req: Request, res: Response) {
  try {
    const board = await BoardService.createBoard(req.body.key, req.body.visibleName);
    res.status(200).json({
      board,
      success: true
    });
  } catch (err) {
    if (err === BoardService.NAME_EXISTS) {
      res.status(400).json({
        error: BoardService.NAME_EXISTS,
        success: false
      });
    } else if (err === BoardService.NAME_INVALID) {
      res.status(400).json({
        error: BoardService.NAME_INVALID,
        success: false
      });
    } else {
      // TODO: Log error
      res.status(500).json({success: false});
    }
  }
}

/**
 * @description Controller for `PUT /admin/board/rename`
 */
export async function renameBoard(req: Request, res: Response) {
  try {
    const board = await BoardService.renameBoard(req.body.key, req.body.newName);
    res.status(200).json({
      board,
      success: true
    });
  } catch (err) {
    if (err === BoardService.BOARD_NEXIST) {
      res.status(400).json({
        error: BoardService.BOARD_NEXIST,
        success: false
      });
    } else {
      // TODO: Log error
      res.status(500).json({success: false});
    }
  }
}

/**
 * @description Controller for `GET /:key/list`
 */
export async function listBoard(req: Request, res: Response) {
  try {
    const perm = await BoardService.getBoardPermissions(req.params.key);
    const hasPerm = checkUserLevel(req, perm.list);
    if (!hasPerm) {
      // 404 by design;
      // nonexistant board should be indistinguishable due to security reasons
      res.status(404).json({success: false});
    } else {
      const posts = await BoardService.listBoard(req.params.key, req.query.page ?? 1);
      res.status(200).json({
        posts,
        success: true
      });
    }
  } catch (err) {
    if (err === BoardService.BOARD_NEXIST) {
      res.status(404).json({success: false});
    } else {
      // TODO: Log error
      res.status(500).json({success: false});
    }
  }
}

/**
 * @description Controller for `POST /:key/write`
 */
export async function writePost(req: Request, res: Response) {
  try {
    // 403 if not logged in (obviously)
    if (!req.currentUser) {
      res.status(403).json({success: false});
      return;
    }
    const perm = await BoardService.getBoardPermissions(req.params.key);
    const hasPerm = checkUserLevel(req, perm.write);
    if (!hasPerm) {
      // 404 by design
      res.status(404).json({success: false});
    } else {
      const cleanContent = DOMPurify.sanitize(req.body.content);
      const newPost = await BoardService.createPost(
        req.currentUser._id,
        req.params.board,
        cleanContent,
        req.body.title
      );
      res.status(200).json({
        post: newPost,
        success: true
      });
    }
  } catch (err) {
    if (err === BoardService.BOARD_NEXIST) {
      res.status(404).json({success: false});
    } else {
      // TODO: Log error
      res.status(500).json({success: false});
    }
  }
}

/**
 * @description Controller for `GET /:key/:postID`
 */
export async function getPost(req: Request, res: Response) {
  try {
    const perm = await BoardService.getBoardPermissions(req.params.key);
    const hasPerm = checkUserLevel(req, perm.read);
    if (!hasPerm) {
      res.status(404).json({success: false});
    } else {
      const post = await BoardService.getPostById(new ObjectId(req.params.id));
      if (!post) {
        res.status(404).json({success: false});
      } else {
        res.status(200).json({
          post,
          success: true
        });
      }
    }
  } catch (err) {
    if (err === BoardService.BOARD_NEXIST) {
      res.status(404).json({success: false});
    } else {
      // TODO: Log error
      res.status(500).json({success: false});
    }
  }
}
