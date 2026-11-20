import type { Request, Response } from 'express';
import type { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../middleware/errorHandler.js';
import {
  idParamSchema,
  reportBodySchema,
  reportQuerySchema,
  reportUpdateSchema,
} from '../validators/report.js';
import { reportInclude } from '../types/index.js';
import type { PaginatedResponse, ReportWithRelations } from '../types/index.js';

export async function listReports(
  req: Request,
  res: Response<PaginatedResponse<ReportWithRelations>>,
): Promise<void> {
  const { search, status, categoryId, page, pageSize } = reportQuerySchema.parse(req.query);
  const where: Prisma.ReportWhereInput = {
    ...(status && { status }),
    ...(categoryId && { categoryId }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };
  const [total, data] = await Promise.all([
    prisma.report.count({ where }),
    prisma.report.findMany({
      where,
      include: reportInclude,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  res.json({ data, meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
}

export async function getReport(req: Request, res: Response<ReportWithRelations>): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  const report = await prisma.report.findUnique({ where: { id }, include: reportInclude });
  if (!report) throw new HttpError(404, 'Report not found');
  res.json(report);
}

export async function createReport(req: Request, res: Response<ReportWithRelations>): Promise<void> {
  const body = reportBodySchema.parse(req.body);
  const authorId = req.user?.id;
  if (authorId === undefined) throw new HttpError(401, 'Authentication required');
  const report = await prisma.report.create({
    data: { ...body, authorId },
    include: reportInclude,
  });
  res.status(201).json(report);
}

export async function updateReport(req: Request, res: Response<ReportWithRelations>): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  const body = reportUpdateSchema.parse(req.body);
  const report = await prisma.report.update({ where: { id }, data: body, include: reportInclude });
  res.json(report);
}

export async function deleteReport(req: Request, res: Response): Promise<void> {
  const { id } = idParamSchema.parse(req.params);
  await prisma.report.delete({ where: { id } });
  res.status(204).send();
}
