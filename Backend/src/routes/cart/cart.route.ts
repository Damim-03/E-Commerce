import { Router } from 'express'
import { protectRoute } from '../../middlewares/only-admin/auth.middleware';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../../controllers/users/cart/cart.controller';

const cartRoutes: Router = Router();

cartRoutes.use(protectRoute)

cartRoutes.get('/', getCart);
cartRoutes.post('/', addToCart);
cartRoutes.put('/:productId', updateCartItem);
cartRoutes.delete('/:productId', removeFromCart);
cartRoutes.delete('/', clearCart);

export default cartRoutes;