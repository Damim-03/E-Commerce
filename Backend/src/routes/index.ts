import { Router } from "express";
import adminRoutes from "./admin/admin.route";

const rootRouter = Router();

rootRouter.use('/admin', adminRoutes)

export default rootRouter;