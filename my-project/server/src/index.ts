import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import { reportRouter } from "./routes/reportRoutes.js";
import { categoryRouter } from "./routes/categoryRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import { meRouter } from "./routes/meRoutes.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/reports", reportRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/me", meRouter);

// ไม่มี route ไหนตรง
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "ไม่พบ path นี้" });
});

// error ที่ไม่ได้คาดไว้ทั้งหมดมาจบที่นี่
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "เกิดข้อผิดพลาดใน server" });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}/api`);
});