import { Router } from "express";
import { myVotes } from "../controllers/voteController.js";
import { requireAuth } from "../middleware/auth.js";

export const meRouter = Router();

meRouter.get("/votes", requireAuth, myVotes);