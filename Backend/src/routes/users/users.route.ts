import { Router } from 'express';
import { protectRoute } from '../../middlewares/only-admin/auth.middleware';
import { addAddress, deleteAddress, getAddresses, updateAddress } from '../../controllers/users/addresses/address.controller';
import { errorHandler } from '../../helpers/ERRORS/error-handler';
import { addToWishlist, getWishlist, removeFromWishlist } from '../../controllers/users/wishlist/wishlist.controller';

const usersRoutes: Router = Router();

usersRoutes.use(protectRoute);

usersRoutes.post('/addresses', errorHandler(addAddress));
usersRoutes.get('/addresses', errorHandler(getAddresses));
usersRoutes.put('/addresses/:addressId', errorHandler(updateAddress));
usersRoutes.delete('/addresses/:addressId', errorHandler(deleteAddress));

usersRoutes.post('/wishlist', addToWishlist);
usersRoutes.get('/wishlist', getWishlist);
usersRoutes.delete('/wishlist/:productId', removeFromWishlist);

export default usersRoutes;