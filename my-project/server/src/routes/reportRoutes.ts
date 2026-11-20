import { Router } from "express";
import { listReports, getReport } from "../controllers/reportController.js";

export const reportRouter = Router();

reportRouter.get("/", listReports);
reportRouter.get("/:id", getReport);