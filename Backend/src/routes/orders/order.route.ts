import { Router } from "express";
import { protectRoute } from "../../middlewares/only-admin/auth.middleware";
import { createOrders, getUserOrders } from "../../controllers/users/orders/order.controller";

const orderRoutes: Router = Router();

orderRoutes.use(protectRoute) 

orderRoutes.post('/', createOrders);
orderRoutes.get('/', getUserOrders);

export default orderRoutes;