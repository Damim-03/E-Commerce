import express, { Request, Response } from "express";
import path from "path";
import { clerkMiddleware } from '@clerk/express'
import { NODE_ENV } from "./config/env";

const app = express();

app.use(express.json());
app.use(clerkMiddleware())

app.get("/api/health", (_req: Request, res: Response) => {
  res.send("The server is healthy.");
});

if (NODE_ENV === "production") {
  // 👇 IMPORTANT: go UP TWO levels from Backend/dist → project root → admin/dist
  const frontendPath = path.join(__dirname, "../../admin/dist");

  app.use(express.static(frontendPath));

  app.use((_req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

export default app;
