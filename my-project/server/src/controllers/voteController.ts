import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function toggleVote(req: Request, res: Response) {
  const userId = req.user?.id;
  if (userId === undefined) {
    res.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });
    return;
  }
  const reportId = Number(req.params.id);
  if (!Number.isInteger(reportId)) {
    res.status(400).json({ message: "id ต้องเป็นตัวเลข" });
    return;
  }

  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) {
    res.status(404).json({ message: "ไม่พบรายงาน" });
    return;
  }

  // userId_reportId มาจาก @@unique([userId, reportId]) ใน schema
  const existing = await prisma.vote.findUnique({
    where: { userId_reportId: { userId, reportId } },
  });

  if (existing) {
    await prisma.vote.delete({ where: { id: existing.id } });
  } else {
    await prisma.vote.create({ data: { userId, reportId } });
  }

  const voteCount = await prisma.vote.count({ where: { reportId } });
  res.json({ voted: !existing, voteCount });
}

export async function myVotes(req: Request, res: Response) {
  const userId = req.user?.id;
  if (userId === undefined) {
    res.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });
    return;
  }
  const votes = await prisma.vote.findMany({
    where: { userId },
    select: { reportId: true },
  });
  res.json(votes.map((v) => v.reportId));
}