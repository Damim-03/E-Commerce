import { Request, Response, NextFunction } from "express"
import { Cart } from "../../../models/products/cart.model"
import HttpException, { ErrorCodes } from "../../../helpers/ROOTS/root";
import { Product } from "../../../models/products/product.model";

export const getCart = async(req: Request, res: Response, next: NextFunction) => {
    try {
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

    let cart = await Cart.findOne({
      clerkId: user.clerkId,
    }).populate("items.product");

    // 🛒 إذا لم يوجد cart → أنشئ واحد جديد
    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }

    return res.status(200).json({ cart });
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

export const addToCart = async(req: Request, res: Response, next: NextFunction) => {
    try {
    const user = (req as any).user;
    const { productId, quantity = 1 } = req.body;

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

    if (quantity <= 0) {
      return next(
        new HttpException(
          "Quantity must be greater than 0",
          ErrorCodes.INVALID_INPUT,
          400
        )
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return next(
        new HttpException(
          "Product not found",
          ErrorCodes.PRODUCT_NOT_FOUND,
          404
        )
      );
    }

    if (product.stock < quantity) {
      return next(
        new HttpException(
          "Insufficient stock",
          ErrorCodes.PRODUCT_OUT_OF_STOCK,
          400
        )
      );
    }

    let cart = await Cart.findOne({ clerkId: user.clerkId });

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item: any) => item.product.toString() === productId.toString()
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return next(
          new HttpException(
            "Insufficient stock",
            ErrorCodes.PRODUCT_OUT_OF_STOCK,
            400
          )
        );
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    return res.status(200).json({
      message: "Item added to cart",
      cart,
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

export const updateCartItem = async(req: Request, res: Response, next: NextFunction) => {
    try {
    const user = (req as any).user;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!user) {
      return next(
        new HttpException(
          "Unauthorized",
          ErrorCodes.UNAUTHORIZED,
          401
        )
      );
    }

    if (!productId || quantity === undefined) {
      return next(
        new HttpException(
          "Product ID and quantity are required",
          ErrorCodes.MISSING_REQUIRED_FIELDS,
          422
        )
      );
    }

    if (quantity < 1) {
      return next(
        new HttpException(
          "Quantity must be at least 1",
          ErrorCodes.INVALID_INPUT,
          400
        )
      );
    }

    const cart = await Cart.findOne({ clerkId: user.clerkId });

    if (!cart) {
      return next(
        new HttpException(
          "Cart not found",
          ErrorCodes.NOT_FOUND,
          404
        )
      );
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return next(
        new HttpException(
          "Item not found in cart",
          ErrorCodes.NOT_FOUND,
          404
        )
      );
    }

    const product = await Product.findById(productId);

    if (!product) {
      return next(
        new HttpException(
          "Product not found",
          ErrorCodes.PRODUCT_NOT_FOUND,
          404
        )
      );
    }

    if (product.stock < quantity) {
      return next(
        new HttpException(
          "Insufficient stock",
          ErrorCodes.PRODUCT_OUT_OF_STOCK,
          400
        )
      );
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return res.status(200).json({
      message: "Cart item updated successfully",
      cart,
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

export const removeFromCart = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { productId } = req.params;

    if (!user) {
      return next(
        new HttpException(
          "Unauthorized",
          ErrorCodes.UNAUTHORIZED,
          401
        )
      );
    }

    const cart = await Cart.findOne({ clerkId: user.clerkId });

    if (!cart) {
      return next(
        new HttpException(
          "Cart not found",
          ErrorCodes.NOT_FOUND,
          404
        )
      );
    }

    const item = cart.items.find(
      (item: any) => item.product.toString() === productId.toString()
    );

    if (!item) {
      return next(
        new HttpException(
          "Item not found in cart",
          ErrorCodes.NOT_FOUND,
          404
        )
      );
    }

    // ✅ الحل الصحيح
    item.deleteOne();
    await cart.save();

    return res.status(200).json({
      message: "Item removed from cart",
      cart,
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

export const clearCart = async(req: Request, res: Response, next: NextFunction) => {
  try {
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

    const cart = await Cart.findOne({ clerkId: user.clerkId });

    if (!cart) {
      return next(
        new HttpException(
          "Cart not found",
          ErrorCodes.NOT_FOUND,
          404
        )
      );
    }

    // ✅ الحل الصحيح
    cart.items.splice(0);

    await cart.save();

    return res.status(200).json({
      message: "Cart cleared successfully",
      cart,
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
};