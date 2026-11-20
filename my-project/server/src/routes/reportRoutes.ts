import { Router } from "express";
import {
  listReports,
  getReport,
  createReport,
  updateReportStatus,
  deleteReport,
} from "../controllers/reportController.js";
import { toggleVote } from "../controllers/voteController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

export const reportRouter = Router();

reportRouter.get("/", listReports);
reportRouter.get("/:id", getReport);
reportRouter.post("/", requireAuth, createReport);
reportRouter.post("/:id/vote", requireAuth, toggleVote);
reportRouter.patch("/:id/status", requireAdmin, updateReportStatus);
reportRouter.delete("/:id", requireAdmin, deleteReport);