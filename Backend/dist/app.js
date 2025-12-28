"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_2 = require("@clerk/express");
const express_3 = require("inngest/express");
const inngest_1 = require("./config/inngest");
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, express_2.clerkMiddleware)());
app.use((0, cors_1.default)({
    origin: env_1.CLIENT_URL,
    credentials: true,
}));
app.use("/api", routes_1.default);
app.use("/api/inngest", (0, express_3.serve)({
    client: inngest_1.inngest,
    functions: inngest_1.functions,
}));
app.get("/api/health", (_req, res) => {
    res.send("The server is healthy.");
});
if (env_1.NODE_ENV === "production") {
    // 👇 IMPORTANT: go UP TWO levels from Backend/dist → project root → admin/dist
    const frontendPath = path_1.default.join(__dirname, "../../admin/dist");
    app.use(express_1.default.static(frontendPath));
    app.use((_req, res) => {
        res.sendFile(path_1.default.join(frontendPath, "index.html"));
    });
}
exports.default = app;
