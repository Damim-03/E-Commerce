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
exports.deleteReview = exports.createReview = void 0;
const order_model_1 = require("../../../models/orders/order.model");
const review_model_1 = require("../../../models/reviews/review.model");
const product_model_1 = require("../../../models/products/product.model");
const root_1 = __importStar(require("../../../helpers/ROOTS/root"));
const createReview = async (req, res, next) => {
    try {
        const { productId, orderId, rating } = req.body;
        const user = req.user;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        if (!productId || !orderId || rating === undefined) {
            return next(new root_1.default("Missing required fields", root_1.ErrorCodes.MISSING_REQUIRED_FIELDS, 422));
        }
        if (rating < 1 || rating > 5) {
            return next(new root_1.default("Rating must be between 1 and 5", root_1.ErrorCodes.INVALID_INPUT, 400));
        }
        const order = await order_model_1.Order.findById(orderId);
        if (!order) {
            return next(new root_1.default("Order not found", root_1.ErrorCodes.ORDER_NOT_FOUND, 404));
        }
        if (order.clerkId !== user.clerkId) {
            return next(new root_1.default("You can only review your own orders", root_1.ErrorCodes.FORBIDDEN, 403));
        }
        if (order.status !== "delivered") {
            return next(new root_1.default("Can only review delivered orders", root_1.ErrorCodes.ORDER_STATUS_INVALID, 400));
        }
        const productInOrder = order.orderItems.find((item) => item.product.toString() === productId.toString());
        if (!productInOrder) {
            return next(new root_1.default("Product not found in this order", root_1.ErrorCodes.PRODUCT_NOT_FOUND, 400));
        }
        const existingReview = await review_model_1.Review.findOne({
            productId,
            userId: user._id,
        });
        if (existingReview) {
            return next(new root_1.default("You have already reviewed this product", root_1.ErrorCodes.INVALID_INPUT, 400));
        }
        // 📝 إنشاء التقييم
        const review = await review_model_1.Review.create({
            productId,
            userId: user._id,
            orderId,
            rating,
        });
        // ⭐ تحديث تقييم المنتج
        const product = await product_model_1.Product.findById(productId);
        if (product) {
            const reviews = await review_model_1.Review.find({ productId });
            const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
            product.averageRating = totalRating / reviews.length;
            product.totalReviews = reviews.length;
            await product.save();
        }
        return res.status(201).json({
            message: "Review created successfully",
            review,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.createReview = createReview;
const deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const user = req.user;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        if (!reviewId) {
            return next(new root_1.default("Review ID is required", root_1.ErrorCodes.MISSING_REQUIRED_FIELDS, 422));
        }
        const review = await review_model_1.Review.findById(reviewId);
        if (!review) {
            return next(new root_1.default("Review not found", root_1.ErrorCodes.NOT_FOUND, 404));
        }
        if (review.userId.toString() !== user._id.toString()) {
            return next(new root_1.default("Not authorized to delete this review", root_1.ErrorCodes.FORBIDDEN, 403));
        }
        const productId = review.productId;
        await review_model_1.Review.findByIdAndDelete(reviewId);
        // ⭐ إعادة حساب تقييم المنتج
        const reviews = await review_model_1.Review.find({ productId });
        const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
        await product_model_1.Product.findByIdAndUpdate(productId, {
            averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
            totalReviews: reviews.length,
        });
        return res.status(200).json({
            message: "Review deleted successfully",
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.deleteReview = deleteReview;
