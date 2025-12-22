import app from "./app";
import {PORT} from "./config/env";
import { connectDB } from "./db/db";
import { errorMiddleware } from "./middlewares/error-middleware/errors";

app.use(errorMiddleware as any);  // يجب أن يكون آخر middleware

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});
