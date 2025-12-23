import { Product } from "../../../models/products/product.model";
import { Order } from "../../../models/orders/order.model";
import HttpException, { ErrorCodes } from "../../../helpers/ROOTS/root";
import { Review } from "../../../models/reviews/review.model";


export const createOrders = async(req: any, res: any, next: any) => {
    try {
    const user = (req as any).user;

    const {
      orderItems,
      shippingAddress,
      paymentResult,
      totalPrice,
    } = req.body;

    if (!user) {
      return next(
        new HttpException(
          "Unauthorized",
          ErrorCodes.UNAUTHORIZED,
          401
        )
      );
    }

    if (!orderItems || orderItems.length === 0) {
      return next(
        new HttpException(
          "No order items",
          ErrorCodes.UNPROCESSABLE_ENTITY,
          422
        )
      );
    }

    // 🔎 التحقق من المنتجات والمخزون
    for (const item of orderItems) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return next(
          new HttpException(
            `Product with ID ${item.product._id} not found`,
            ErrorCodes.PRODUCT_NOT_FOUND,
            404
          )
        );
      }

      if (product.stock < item.quantity) {
        return next(
          new HttpException(
            `Insufficient stock for product ${product.name}`,
            ErrorCodes.PRODUCT_OUT_OF_STOCK,
            400
          )
        );
      }
    }

    // 🧾 إنشاء الطلب
    const order = await Order.create({
      user: user._id,
      clerkId: user.clerkId,
      orderItems,
      shippingAddress,
      paymentResult,
      totalPrice,
    });

    // 📉 خصم الكمية من المخزون
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    return res.status(201).json({
      message: "Order created successfully",
      order,
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

export const getUserOrders = async(req: any, res: any, next: any) => {
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

    const orders = await Order.find({
      clerkId: user.clerkId,
    })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    // 🧠 جلب كل الـ reviews مرة واحدة
    const orderIds = orders.map((order) => order._id);
    const reviews = await Review.find({
      orderId: { $in: orderIds },
    });

    const reviewedOrderIds = new Set(
      reviews.map((review) => review.orderId.toString())
    );

    // ✅ تحديد hasReviewed بدون أي query إضافي
    const ordersWithReviewStatus = orders.map((order) => ({
      ...order.toObject(),
      hasReviewed: reviewedOrderIds.has(order._id.toString()),
    }));

    return res.status(200).json({
      orders: ordersWithReviewStatus,
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