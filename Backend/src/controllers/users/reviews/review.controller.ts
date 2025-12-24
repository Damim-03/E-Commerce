import { Order } from "../../../models/orders/order.model";
import { Review } from "../../../models/reviews/review.model";
import { Product } from "../../../models/products/product.model";
import HttpException, { ErrorCodes } from "../../../helpers/ROOTS/root";


export const createReview = async(req: any, res: any, next: any) => {
    try {
    const { productId, orderId, rating } = req.body;
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

    if (!productId || !orderId || rating === undefined) {
      return next(
        new HttpException(
          "Missing required fields",
          ErrorCodes.MISSING_REQUIRED_FIELDS,
          422
        )
      );
    }

    if (rating < 1 || rating > 5) {
      return next(
        new HttpException(
          "Rating must be between 1 and 5",
          ErrorCodes.INVALID_INPUT,
          400
        )
      );
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return next(
        new HttpException(
          "Order not found",
          ErrorCodes.ORDER_NOT_FOUND,
          404
        )
      );
    }

    if (order.clerkId !== user.clerkId) {
      return next(
        new HttpException(
          "You can only review your own orders",
          ErrorCodes.FORBIDDEN,
          403
        )
      );
    }

    if (order.status !== "delivered") {
      return next(
        new HttpException(
          "Can only review delivered orders",
          ErrorCodes.ORDER_STATUS_INVALID,
          400
        )
      );
    }

    const productInOrder = order.orderItems.find(
      (item: any) => item.product.toString() === productId.toString()
    );

    if (!productInOrder) {
      return next(
        new HttpException(
          "Product not found in this order",
          ErrorCodes.PRODUCT_NOT_FOUND,
          400
        )
      );
    }

    const existingReview = await Review.findOne({
      productId,
      userId: user._id,
    });

    if (existingReview) {
      return next(
        new HttpException(
          "You have already reviewed this product",
          ErrorCodes.INVALID_INPUT,
          400
        )
      );
    }

    // 📝 إنشاء التقييم
    const review = await Review.create({
      productId,
      userId: user._id,
      orderId,
      rating,
    });

    // ⭐ تحديث تقييم المنتج
    const product = await Product.findById(productId);
    if (product) {
      const reviews = await Review.find({ productId });
      const totalRating = reviews.reduce(
        (sum, rev) => sum + rev.rating,
        0
      );

      product.averageRating = totalRating / reviews.length;
      product.totalReviews = reviews.length;

      await product.save();
    }

    return res.status(201).json({
      message: "Review created successfully",
      review,
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

export const deleteReview = async(req: any, res: any, next: any) => {
    try {
    const { reviewId } = req.params;
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

    if (!reviewId) {
      return next(
        new HttpException(
          "Review ID is required",
          ErrorCodes.MISSING_REQUIRED_FIELDS,
          422
        )
      );
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return next(
        new HttpException(
          "Review not found",
          ErrorCodes.NOT_FOUND,
          404
        )
      );
    }

    if (review.userId.toString() !== user._id.toString()) {
      return next(
        new HttpException(
          "Not authorized to delete this review",
          ErrorCodes.FORBIDDEN,
          403
        )
      );
    }

    const productId = review.productId;

    await Review.findByIdAndDelete(reviewId);

    // ⭐ إعادة حساب تقييم المنتج
    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce(
      (sum, rev) => sum + rev.rating,
      0
    );

    await Product.findByIdAndUpdate(productId, {
      averageRating:
        reviews.length > 0 ? totalRating / reviews.length : 0,
      totalReviews: reviews.length,
    });

    return res.status(200).json({
      message: "Review deleted successfully",
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