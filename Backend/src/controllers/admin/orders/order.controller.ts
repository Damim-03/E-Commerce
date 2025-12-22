import { NextFunction } from "express";
import { Order } from "../../../models/orders/order.model"
import HttpException, { ErrorCodes } from "../../../helpers/ROOTS/root";
import { BadRequestsException } from "../../../helpers/BAD-REQ/Bad-request";
import { NotFoundException } from "../../../helpers/NOT-FOUND/not-found";


export const getAllOrders = async ( req: any, res: any, next: any ) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product");

    return res.status(200).json({
      orders,
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

export const updateOrderStatus = async ( req: any, res: any, next: any ) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["Pending", "Shipped", "Delivered"];

  if (!allowedStatuses.includes(status)) {
    return next(
      new BadRequestsException(
        "Invalid status value",
        ErrorCodes.UNPROCESSABLE_ENTITY
      )
    );
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return next(
      new NotFoundException(
        "Order not found",
        ErrorCodes.ORDER_NOT_FOUND
      )
    );
  }

  order.status = status;

  if (status === "Shipped" && !order.shippedAt) {
    order.shippedAt = new Date();
  }

  if (status === "Delivered" && !order.deliveredAt) {
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({
    message: "Order status updated successfully",
    order,
  });
};