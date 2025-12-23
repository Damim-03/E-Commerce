import { Router } from "express";
import adminRoutes from "./admin/admin.route";
import usersRoutes from "./users/users.route";

const rootRouter = Router();

rootRouter.use('/admin', adminRoutes)
rootRouter.use('/users', usersRoutes);

export default rootRouter;