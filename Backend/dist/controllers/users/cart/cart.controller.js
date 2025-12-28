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
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const cart_model_1 = require("../../../models/products/cart.model");
const root_1 = __importStar(require("../../../helpers/ROOTS/root"));
const product_model_1 = require("../../../models/products/product.model");
const getCart = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        let cart = await cart_model_1.Cart.findOne({
            clerkId: user.clerkId,
        }).populate("items.product");
        // 🛒 إذا لم يوجد cart → أنشئ واحد جديد
        if (!cart) {
            cart = await cart_model_1.Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: [],
            });
        }
        return res.status(200).json({ cart });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.getCart = getCart;
const addToCart = async (req, res, next) => {
    try {
        const user = req.user;
        const { productId, quantity = 1 } = req.body;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        if (!productId) {
            return next(new root_1.default("Product ID is required", root_1.ErrorCodes.MISSING_REQUIRED_FIELDS, 422));
        }
        if (quantity <= 0) {
            return next(new root_1.default("Quantity must be greater than 0", root_1.ErrorCodes.INVALID_INPUT, 400));
        }
        const product = await product_model_1.Product.findById(productId);
        if (!product) {
            return next(new root_1.default("Product not found", root_1.ErrorCodes.PRODUCT_NOT_FOUND, 404));
        }
        if (product.stock < quantity) {
            return next(new root_1.default("Insufficient stock", root_1.ErrorCodes.PRODUCT_OUT_OF_STOCK, 400));
        }
        let cart = await cart_model_1.Cart.findOne({ clerkId: user.clerkId });
        if (!cart) {
            cart = await cart_model_1.Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: [],
            });
        }
        const existingItem = cart.items.find((item) => item.product.toString() === productId.toString());
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (product.stock < newQuantity) {
                return next(new root_1.default("Insufficient stock", root_1.ErrorCodes.PRODUCT_OUT_OF_STOCK, 400));
            }
            existingItem.quantity = newQuantity;
        }
        else {
            cart.items.push({
                product: productId,
                quantity,
            });
        }
        await cart.save();
        return res.status(200).json({
            message: "Item added to cart",
            cart,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (req, res, next) => {
    try {
        const user = req.user;
        const { productId } = req.params;
        const { quantity } = req.body;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        if (!productId || quantity === undefined) {
            return next(new root_1.default("Product ID and quantity are required", root_1.ErrorCodes.MISSING_REQUIRED_FIELDS, 422));
        }
        if (quantity < 1) {
            return next(new root_1.default("Quantity must be at least 1", root_1.ErrorCodes.INVALID_INPUT, 400));
        }
        const cart = await cart_model_1.Cart.findOne({ clerkId: user.clerkId });
        if (!cart) {
            return next(new root_1.default("Cart not found", root_1.ErrorCodes.NOT_FOUND, 404));
        }
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId.toString());
        if (itemIndex === -1) {
            return next(new root_1.default("Item not found in cart", root_1.ErrorCodes.NOT_FOUND, 404));
        }
        const product = await product_model_1.Product.findById(productId);
        if (!product) {
            return next(new root_1.default("Product not found", root_1.ErrorCodes.PRODUCT_NOT_FOUND, 404));
        }
        if (product.stock < quantity) {
            return next(new root_1.default("Insufficient stock", root_1.ErrorCodes.PRODUCT_OUT_OF_STOCK, 400));
        }
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        return res.status(200).json({
            message: "Cart item updated successfully",
            cart,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.updateCartItem = updateCartItem;
const removeFromCart = async (req, res, next) => {
    try {
        const user = req.user;
        const { productId } = req.params;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        const cart = await cart_model_1.Cart.findOne({ clerkId: user.clerkId });
        if (!cart) {
            return next(new root_1.default("Cart not found", root_1.ErrorCodes.NOT_FOUND, 404));
        }
        const item = cart.items.find((item) => item.product.toString() === productId.toString());
        if (!item) {
            return next(new root_1.default("Item not found in cart", root_1.ErrorCodes.NOT_FOUND, 404));
        }
        // ✅ الحل الصحيح
        item.deleteOne();
        await cart.save();
        return res.status(200).json({
            message: "Item removed from cart",
            cart,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.removeFromCart = removeFromCart;
const clearCart = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        const cart = await cart_model_1.Cart.findOne({ clerkId: user.clerkId });
        if (!cart) {
            return next(new root_1.default("Cart not found", root_1.ErrorCodes.NOT_FOUND, 404));
        }
        // ✅ الحل الصحيح
        cart.items.splice(0);
        await cart.save();
        return res.status(200).json({
            message: "Cart cleared successfully",
            cart,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.clearCart = clearCart;
