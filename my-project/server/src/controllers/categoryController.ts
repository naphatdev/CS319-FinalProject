import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function listCategories(_req: Request, res: Response) {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { id: "asc" },
  });
  res.json(categories);
}