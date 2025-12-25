import express, { Request, Response } from "express";
import path from "path";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest";
import { CLIENT_URL, NODE_ENV } from "./config/env";
import rootRouter from "./routes";
import cors from "cors"

const app = express();

app.use(express.json());
app.use(clerkMiddleware())
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}))

app.use('/api', rootRouter);

app.use("/api/inngest", serve({
  client: inngest,
  functions,
}))

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
