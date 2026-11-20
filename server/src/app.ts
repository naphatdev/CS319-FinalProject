import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import type { Express } from 'express';
import { router } from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp(): Express {
  const app = express();
  app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
  app.use(express.json());
  app.use('/api', router);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
