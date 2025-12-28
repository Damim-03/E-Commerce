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
exports.removeFromWishlist = exports.getWishlist = exports.addToWishlist = void 0;
const root_1 = __importStar(require("../../../helpers/ROOTS/root"));
const user_model_1 = require("../../../models/users/user.model");
const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        if (!productId) {
            return next(new root_1.default("Product ID is required", root_1.ErrorCodes.MISSING_REQUIRED_FIELDS, 422));
        }
        if (user.wishlist.includes(productId)) {
            return next(new root_1.default("Product already in wishlist", root_1.ErrorCodes.INVALID_INPUT, 400));
        }
        user.wishlist.push(productId);
        await user.save();
        return res.status(200).json({
            message: "Product added to wishlist",
            wishlist: user.wishlist,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.addToWishlist = addToWishlist;
const getWishlist = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user._id).populate('wishlist');
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        return res.status(200).json({
            wishlist: user.wishlist,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.getWishlist = getWishlist;
const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const user = req.user;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        if (!productId) {
            return next(new root_1.default("Product ID is required", root_1.ErrorCodes.MISSING_REQUIRED_FIELDS, 422));
        }
        if (!user.wishlist.includes(productId)) {
            return next(new root_1.default("Product not in wishlist", root_1.ErrorCodes.PRODUCT_NOT_FOUND, 400));
        }
        user.wishlist.pull(productId);
        await user.save();
        return res.status(200).json({
            message: "Product removed from wishlist",
            wishlist: user.wishlist,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.removeFromWishlist = removeFromWishlist;
