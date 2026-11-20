import { z } from 'zod';

export const idParamSchema = z.object({ id: z.coerce.number().int().positive() });

export const reportBodySchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(5).max(2000),
  location: z.string().trim().min(2).max(200),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED']).optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  imageUrl: z.string().url().nullable().optional(),
  categoryId: z.number().int().positive(),
});

export const reportUpdateSchema = reportBodySchema.partial();

export const reportQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED']).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(9),
});
