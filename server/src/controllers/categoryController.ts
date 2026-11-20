import type { Request, Response } from 'express';
import type { Category } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export async function listCategories(_req: Request, res: Response<Category[]>): Promise<void> {
  res.json(await prisma.category.findMany({ orderBy: { id: 'asc' } }));
}
