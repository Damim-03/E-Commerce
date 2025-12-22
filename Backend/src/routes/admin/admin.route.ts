import { Router } from "express";
import { errorHandler } from "../../helpers/ERRORS/error-handler";
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../../controllers/admin/products/product.controller";
import { onlyAdmin, protectRoute } from "../../middlewares/only-admin/auth.middleware";
import { upload } from "../../middlewares/multer/multer.middlware";
import { getAllOrders, updateOrderStatus } from "../../controllers/admin/orders/order.controller";
import { get } from "node:http";
import { getAllCustomers, getDashboardStats } from "../../controllers/admin/dashboard/dashboard.controller";

const adminRoutes: Router = Router();

adminRoutes.use(protectRoute, onlyAdmin);

adminRoutes.post("/products", upload.array("images", 3), errorHandler(createProduct))
adminRoutes.get("/products", errorHandler(getAllProducts))
adminRoutes.put("/products/:id", upload.array("images", 3), errorHandler(updateProduct))
adminRoutes.delete("/products/:id", errorHandler(deleteProduct))

adminRoutes.get("/orders", getAllOrders);
adminRoutes.patch("/orders/:orderId/status", updateOrderStatus);

adminRoutes.get("/customers", getAllCustomers);
adminRoutes.get("/stats", getDashboardStats);


export default adminRoutes;