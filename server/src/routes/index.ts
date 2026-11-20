import { Router } from 'express';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import * as reports from '../controllers/reportController.js';
import * as auth from '../controllers/authController.js';
import * as votes from '../controllers/voteController.js';
import { listCategories } from '../controllers/categoryController.js';
import { getStats } from '../controllers/statsController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const wrap =
  (fn: AsyncHandler): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

export const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// auth
router.post('/auth/register', wrap(auth.register));
router.post('/auth/login', wrap(auth.login));
router.get('/auth/me', requireAuth, wrap(auth.me));

// public reads
router.get('/categories', wrap(listCategories));
router.get('/stats', wrap(getStats));
router.get('/reports', wrap(reports.listReports));
router.get('/reports/:id', wrap(reports.getReport));

// logged-in users
router.post('/reports', requireAuth, wrap(reports.createReport));
router.post('/reports/:id/vote', requireAuth, wrap(votes.toggleVote));
router.get('/me/votes', requireAuth, wrap(votes.myVotes));

// admin only
router.put('/reports/:id', requireAdmin, wrap(reports.updateReport));
router.delete('/reports/:id', requireAdmin, wrap(reports.deleteReport));
