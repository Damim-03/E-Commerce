"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = void 0;
const order_model_1 = require("../../../models/orders/order.model");
const root_1 = __importStar(require("../../../helpers/ROOTS/root"));
const Bad_request_1 = require("../../../helpers/BAD-REQ/Bad-request");
const not_found_1 = require("../../../helpers/NOT-FOUND/not-found");
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await order_model_1.Order.find()
            .populate("user", "name email")
            .populate("orderItems.product");
        return res.status(200).json({
            orders,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["Pending", "Shipped", "Delivered"];
    if (!allowedStatuses.includes(status)) {
        return next(new Bad_request_1.BadRequestsException("Invalid status value", root_1.ErrorCodes.UNPROCESSABLE_ENTITY));
    }
    const order = await order_model_1.Order.findById(orderId);
    if (!order) {
        return next(new not_found_1.NotFoundException("Order not found", root_1.ErrorCodes.ORDER_NOT_FOUND));
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
exports.updateOrderStatus = updateOrderStatus;
