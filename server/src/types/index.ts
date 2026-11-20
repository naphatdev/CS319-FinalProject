import type { Prisma } from '@prisma/client';

export const reportInclude = {
  category: true,
  author: { select: { id: true, name: true } },
  _count: { select: { votes: true } },
} satisfies Prisma.ReportInclude;

export type ReportWithRelations = Prisma.ReportGetPayload<{ include: typeof reportInclude }>;

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

export interface ErrorResponse {
  error: string;
  details?: unknown;
}
