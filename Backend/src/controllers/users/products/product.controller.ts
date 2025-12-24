import HttpException, { ErrorCodes } from "../../../helpers/ROOTS/root";
import { Request, Response, NextFunction } from 'express';
import { Product } from "../../../models/products/product.model";


export const getAllProducts = async (_: any, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({
    products,
  });
  } catch (error) {
      console.error('Error fetching products:', error); // Log internally
      return next(
        new HttpException(
          "Internal server error",
          ErrorCodes.INTERNAL_EXCEPTION,
          500
        )
      );
    }
};

export const getProductById = async(req: Request, res: Response, next: NextFunction) => {
    try {
    const { id } = req.params;

    if (!id) {
      return next(
        new HttpException(
          "Product ID is required",
          ErrorCodes.MISSING_REQUIRED_FIELDS,
          422
        )
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(
        new HttpException(
          "Product not found",
          ErrorCodes.PRODUCT_NOT_FOUND,
          404
        )
      );
    }

    return res.status(200).json(product);
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