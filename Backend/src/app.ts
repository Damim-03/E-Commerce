import express, {Request, Response} from "express"

const app = express()

app.get("/api/health", (req: Request, res: Response) => {
    res.send("The server is healthy.");
});

export default app;