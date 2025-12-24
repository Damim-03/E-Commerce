import { Router } from "express";
import { getAllProducts, getProductById } from "../../controllers/users/products/product.controller";
import { protectRoute } from "../../middlewares/only-admin/auth.middleware";

const productRoutes: Router = Router();

productRoutes.use(protectRoute);

productRoutes.get('/', getAllProducts);
productRoutes.get('/:id', getProductById);

export default productRoutes