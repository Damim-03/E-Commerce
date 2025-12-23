import { Router } from "express";
import adminRoutes from "./admin/admin.route";
import usersRoutes from "./users/users.route";
import orderRoutes from "./orders/order.route";

const rootRouter = Router();

rootRouter.use('/admin', adminRoutes)
rootRouter.use('/users', usersRoutes);
rootRouter.use('/orders', orderRoutes)

export default rootRouter;