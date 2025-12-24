import { Router } from "express";
import { getAllProducts, getProductById } from "../../controllers/users/products/product.controller";

const productRoutes: Router = Router();

productRoutes.use(productRoutes);

productRoutes.get('/', getAllProducts)
productRoutes.get('/:id', getProductById)

export default productRoutes