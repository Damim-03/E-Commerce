import HttpException, { ErrorCodes } from "../../../helpers/ROOTS/root";
import { Product } from "../../../models/products/product.model";


export const getAllProducts = async (_: any, res: any) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({
    products,
  });
};

export const getProductById = async(req: any, res: any, next: any) => {
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