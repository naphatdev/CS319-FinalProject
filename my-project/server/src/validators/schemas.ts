import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "กรุณากรอกชื่อ"),
  email: z.email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

export const loginSchema = z.object({
  email: z.email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export const createReportSchema = z.object({
  title: z.string().trim().min(3, "หัวข้อต้องมีอย่างน้อย 3 ตัวอักษร").max(100, "หัวข้อยาวเกิน 100 ตัวอักษร"),
  description: z.string().trim().min(10, "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร"),
  location: z.string().trim().min(3, "กรุณาระบุสถานที่"),
  categoryId: z.number().int().positive("กรุณาเลือกหมวดหมู่"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED"]),
});