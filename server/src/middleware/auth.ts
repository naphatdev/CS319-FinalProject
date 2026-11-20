import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { HttpError } from './errorHandler.js';

interface TokenPayload {
  sub: string;
  role: Role;
}

function secret(): string {
  return process.env.JWT_SECRET ?? 'dev-secret-change-me';
}

export function signToken(user: { id: number; role: Role }): string {
  return jwt.sign({ role: user.role }, secret(), { subject: String(user.id), expiresIn: '7d' });
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new HttpError(401, 'Authentication required'));
    return;
  }
  try {
    const payload = jwt.verify(header.slice(7), secret()) as TokenPayload;
    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  requireAuth(req, _res, (err?: unknown) => {
    if (err) {
      next(err);
      return;
    }
    if (req.user?.role !== 'ADMIN') {
      next(new HttpError(403, 'Admin access required'));
      return;
    }
    next();
  });
}
