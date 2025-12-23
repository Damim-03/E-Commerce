import HttpException, { ErrorCodes } from "../../../helpers/ROOTS/root";
import { User } from "../../../models/users/user.model";


export const addToWishlist = async(req: any, res: any, next: any) => {
    try {
    const { productId } = req.body;
    const user = (req as any).user;

    if (!user) {
      return next(
        new HttpException(
          "Unauthorized",
          ErrorCodes.UNAUTHORIZED,
          401
        )
      );
    }

    if (!productId) {
      return next(
        new HttpException(
          "Product ID is required",
          ErrorCodes.MISSING_REQUIRED_FIELDS,
          422
        )
      );
    }

    if (user.wishlist.includes(productId)) {
      return next(
        new HttpException(
          "Product already in wishlist",
          ErrorCodes.INVALID_INPUT,
          400
        )
      );
    }

    user.wishlist.push(productId);
    await user.save();

    return res.status(200).json({
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    return next(
      new HttpException(
        "Internal server error",
        ErrorCodes.INTERNAL_EXCEPTION,
        500,
        error
      )
    );
  }
}

export const getWishlist = async(req: any, res: any, next: any) => {
    try {
    const user = await User.findById(req.user._id).populate('wishlist');

    if (!user) {
      return next(
        new HttpException(
          "Unauthorized",
          ErrorCodes.UNAUTHORIZED,
          401
        )
      );
    }

    return res.status(200).json({
      wishlist: user.wishlist,
    });
  } catch (error) {
    return next(
      new HttpException(
        "Internal server error",
        ErrorCodes.INTERNAL_EXCEPTION,
        500,
        error
      )
    );
  }
}

export const removeFromWishlist = async(req: any, res: any, next: any) => {
    try {
    const { productId } = req.params;
    const user = (req as any).user;

    if (!user) {
      return next(
        new HttpException(
          "Unauthorized",
          ErrorCodes.UNAUTHORIZED,
          401
        )
      );
    }

    if (!productId) {
      return next(
        new HttpException(
          "Product ID is required",
          ErrorCodes.MISSING_REQUIRED_FIELDS,
          422
        )
      );
    }

    if (!user.wishlist.includes(productId)) {
      return next(
        new HttpException(
          "Product not in wishlist",
          ErrorCodes.PRODUCT_NOT_FOUND,
          400
        )
      );
    }

    user.wishlist.pull(productId);
    await user.save();

    return res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    return next(
      new HttpException(
        "Internal server error",
        ErrorCodes.INTERNAL_EXCEPTION,
        500,
        error
      )
    );
  }
}