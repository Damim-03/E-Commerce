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
exports.getDashboardStats = exports.getAllCustomers = void 0;
const root_1 = __importStar(require("../../../helpers/ROOTS/root"));
const order_model_1 = require("../../../models/orders/order.model");
const product_model_1 = require("../../../models/products/product.model");
const user_model_1 = require("../../../models/users/user.model");
const getAllCustomers = async (_, res, next) => {
    try {
        const customers = await user_model_1.User.find().sort({ createdAt: -1 });
        return res.status(200).json({
            customers,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.getAllCustomers = getAllCustomers;
const getDashboardStats = async (_, res, next) => {
    try {
        const totalOrders = await order_model_1.Order.countDocuments();
        const revenueResult = await order_model_1.Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalPrice" },
                },
            },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;
        const totalCustomers = await user_model_1.User.countDocuments();
        const totalProducts = await product_model_1.Product.countDocuments();
        return res.status(200).json({
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.getDashboardStats = getDashboardStats;
