import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../middleware/auth.js";
import { loginSchema, registerSchema } from "../validators/schemas.js";

// ส่งเฉพาะข้อมูลที่ปลอดภัย ไม่มี passwordHash
function toPublicUser(user: User) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" });
    return;
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: "อีเมลนี้ถูกใช้แล้ว" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });
  res.status(201).json({ token: signToken({ id: user.id, role: user.role }), user: toPublicUser(user) });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" });
    return;
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  const ok = user !== null && (await bcrypt.compare(password, user.passwordHash));
  if (!user || !ok) {
    res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    return;
  }
  res.json({ token: signToken({ id: user.id, role: user.role }), user: toPublicUser(user) });
}

export async function me(req: Request, res: Response) {
  const userId = req.user?.id;
  if (userId === undefined) {
    res.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });
    return;
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ message: "ไม่พบผู้ใช้" });
    return;
  }
  res.json(toPublicUser(user));
}