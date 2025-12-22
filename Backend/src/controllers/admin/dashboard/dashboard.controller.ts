import HttpException, { ErrorCodes } from "../../../helpers/ROOTS/root";
import { Order } from "../../../models/orders/order.model";
import { Product } from "../../../models/products/product.model";
import { User } from "../../../models/users/user.model"



export const getAllCustomers = async ( _: any, res: any, next: any ) => {
    try {
    const customers = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
      customers,
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

export const getDashboardStats = async ( _: any, res: any, next: any ) => {
    try {
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    return res.status(200).json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
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