import { Router } from "express";
import adminRoutes from "./admin/admin.route";
import usersRoutes from "./users/users.route";
import orderRoutes from "./orders/order.route";
import productRoutes from "./products/product.route";
import reviewRoutes from "./reviews/review.route";
import cartRoutes from "./cart/cart.route";

const rootRouter = Router();

rootRouter.use('/admin', adminRoutes)
rootRouter.use('/users', usersRoutes);
rootRouter.use('/orders', orderRoutes)
rootRouter.use('/product', productRoutes);
rootRouter.use('/reviews', reviewRoutes)
rootRouter.use('/cart', cartRoutes)

export default rootRouter;