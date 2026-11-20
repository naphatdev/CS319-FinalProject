import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";

export interface AuthUser {
  id: number;
  role: Role;
}

// เพิ่ม field user ให้ Request ของ Express ทั้งโปรเจกต์
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("ยังไม่ได้ตั้ง JWT_SECRET ใน .env");
  }
  return secret;
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ id: user.id, role: user.role }, getSecret(), { expiresIn: "7d" });
}

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== "object" || value === null) return false;
  if (!("id" in value) || !("role" in value)) return false;
  return typeof value.id === "number" && (value.role === "USER" || value.role === "ADMIN");
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });
    return;
  }

  try {
    const payload = jwt.verify(header.slice("Bearer ".length), getSecret());
    if (!isAuthUser(payload)) {
      res.status(401).json({ message: "token ไม่ถูกต้อง" });
      return;
    }
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: "token ไม่ถูกต้องหรือหมดอายุ" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({ message: "เฉพาะผู้ดูแลระบบเท่านั้น" });
      return;
    }
    next();
  });
}