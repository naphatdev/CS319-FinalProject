import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../middleware/errorHandler.js';
import { idParamSchema } from '../validators/report.js';

export interface VoteResponse {
  voted: boolean;
  votes: number;
}

// Toggle: one vote per user per report (enforced by @@unique([userId, reportId])).
export async function toggleVote(req: Request, res: Response<VoteResponse>): Promise<void> {
  const { id: reportId } = idParamSchema.parse(req.params);
  const userId = req.user?.id;
  if (userId === undefined) throw new HttpError(401, 'Authentication required');

  const report = await prisma.report.findUnique({ where: { id: reportId }, select: { id: true } });
  if (!report) throw new HttpError(404, 'Report not found');

  const existing = await prisma.vote.findUnique({
    where: { userId_reportId: { userId, reportId } },
  });
  if (existing) {
    await prisma.vote.delete({ where: { id: existing.id } });
  } else {
    await prisma.vote.create({ data: { userId, reportId } });
  }
  const votes = await prisma.vote.count({ where: { reportId } });
  res.json({ voted: !existing, votes });
}

export async function myVotes(req: Request, res: Response<number[]>): Promise<void> {
  const userId = req.user?.id;
  if (userId === undefined) throw new HttpError(401, 'Authentication required');
  const votes = await prisma.vote.findMany({ where: { userId }, select: { reportId: true } });
  res.json(votes.map((v) => v.reportId));
}
