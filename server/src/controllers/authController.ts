import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import type { Role } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../middleware/errorHandler.js';
import { signToken } from '../middleware/auth.js';
import { loginSchema, registerSchema } from '../validators/auth.js';

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}

const publicSelect = { id: true, name: true, email: true, role: true } as const;

export async function register(req: Request, res: Response<AuthResponse>): Promise<void> {
  const { name, email, password } = registerSchema.parse(req.body);
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new HttpError(409, 'Email already registered');
  const user = await prisma.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 10) },
    select: publicSelect,
  });
  res.status(201).json({ token: signToken(user), user });
}

export async function login(req: Request, res: Response<AuthResponse>): Promise<void> {
  const { email, password } = loginSchema.parse(req.body);
  const found = await prisma.user.findUnique({ where: { email } });
  if (!found || !(await bcrypt.compare(password, found.passwordHash))) {
    throw new HttpError(401, 'Invalid email or password');
  }
  const user: PublicUser = { id: found.id, name: found.name, email: found.email, role: found.role };
  res.json({ token: signToken(user), user });
}

export async function me(req: Request, res: Response<PublicUser>): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.user?.id ?? -1 },
    select: publicSelect,
  });
  if (!user) throw new HttpError(401, 'User no longer exists');
  res.json(user);
}
