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
exports.getUserOrders = exports.createOrders = void 0;
const product_model_1 = require("../../../models/products/product.model");
const order_model_1 = require("../../../models/orders/order.model");
const root_1 = __importStar(require("../../../helpers/ROOTS/root"));
const review_model_1 = require("../../../models/reviews/review.model");
const createOrders = async (req, res, next) => {
    try {
        const user = req.user;
        const { orderItems, shippingAddress, paymentResult, totalPrice, } = req.body;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        if (!orderItems || orderItems.length === 0) {
            return next(new root_1.default("No order items", root_1.ErrorCodes.UNPROCESSABLE_ENTITY, 422));
        }
        // 🔎 التحقق من المنتجات والمخزون
        for (const item of orderItems) {
            const product = await product_model_1.Product.findById(item.product._id);
            if (!product) {
                return next(new root_1.default(`Product with ID ${item.product._id} not found`, root_1.ErrorCodes.PRODUCT_NOT_FOUND, 404));
            }
            if (product.stock < item.quantity) {
                return next(new root_1.default(`Insufficient stock for product ${product.name}`, root_1.ErrorCodes.PRODUCT_OUT_OF_STOCK, 400));
            }
        }
        // 🧾 إنشاء الطلب
        const order = await order_model_1.Order.create({
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice,
        });
        // 📉 خصم الكمية من المخزون
        for (const item of orderItems) {
            await product_model_1.Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity },
            });
        }
        return res.status(201).json({
            message: "Order created successfully",
            order,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.createOrders = createOrders;
const getUserOrders = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        const orders = await order_model_1.Order.find({
            clerkId: user.clerkId,
        })
            .populate("orderItems.product")
            .sort({ createdAt: -1 });
        // 🧠 جلب كل الـ reviews مرة واحدة
        const orderIds = orders.map((order) => order._id);
        const reviews = await review_model_1.Review.find({
            orderId: { $in: orderIds },
        });
        const reviewedOrderIds = new Set(reviews.map((review) => review.orderId.toString()));
        // ✅ تحديد hasReviewed بدون أي query إضافي
        const ordersWithReviewStatus = orders.map((order) => ({
            ...order.toObject(),
            hasReviewed: reviewedOrderIds.has(order._id.toString()),
        }));
        return res.status(200).json({
            orders: ordersWithReviewStatus,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.getUserOrders = getUserOrders;
