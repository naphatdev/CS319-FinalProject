import type { Request, Response } from "express";
import { Prisma, ReportStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

// เลือกเฉพาะ field ที่ตกลงไว้ในสัญญา API
const reportSelect = {
  id: true,
  title: true,
  description: true,
  location: true,
  status: true,
  severity: true,
  createdAt: true,
  category: { select: { id: true, name: true } },
  author: { select: { id: true, name: true } },
  _count: { select: { votes: true } },
} satisfies Prisma.ReportSelect;

type ReportRow = Prisma.ReportGetPayload<{ select: typeof reportSelect }>;

// แปลง _count.votes เป็น voteCount ตามสัญญา API
function toReportDto(row: ReportRow) {
  const { _count, ...rest } = row;
  return { ...rest, voteCount: _count.votes };
}

function isReportStatus(value: string): value is ReportStatus {
  return Object.values(ReportStatus).some((s) => s === value);
}

export async function listReports(req: Request, res: Response) {
  const where: Prisma.ReportWhereInput = {};
  const { categoryId, status } = req.query;

  if (typeof categoryId === "string") {
    const id = Number(categoryId);
    if (!Number.isInteger(id)) {
      res.status(400).json({ message: "categoryId ต้องเป็นตัวเลข" });
      return;
    }
    where.categoryId = id;
  }

  if (typeof status === "string") {
    if (!isReportStatus(status)) {
      res.status(400).json({ message: "status ไม่ถูกต้อง" });
      return;
    }
    where.status = status;
  }

  const reports = await prisma.report.findMany({
    where,
    select: reportSelect,
    orderBy: { createdAt: "desc" },
  });
  res.json(reports.map(toReportDto));
}

export async function getReport(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "id ต้องเป็นตัวเลข" });
    return;
  }

  const report = await prisma.report.findUnique({
    where: { id },
    select: reportSelect,
  });
  if (!report) {
    res.status(404).json({ message: "ไม่พบรายงาน" });
    return;
  }
  res.json(toReportDto(report));
}