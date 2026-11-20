import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export interface StatsResponse {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

export async function getStats(_req: Request, res: Response<StatsResponse>): Promise<void> {
  const grouped = await prisma.report.groupBy({ by: ['status'], _count: { _all: true } });
  const count = (s: string): number => grouped.find((g) => g.status === s)?._count._all ?? 0;
  const pending = count('PENDING');
  const inProgress = count('IN_PROGRESS');
  const resolved = count('RESOLVED');
  res.json({ total: pending + inProgress + resolved, pending, inProgress, resolved });
}
