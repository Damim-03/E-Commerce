import app from "./app";
import {PORT} from "./config/env";
import { connectDB } from "./db/db";

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});
