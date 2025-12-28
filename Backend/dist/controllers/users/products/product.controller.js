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
exports.getProductById = exports.getAllProducts = void 0;
const root_1 = __importStar(require("../../../helpers/ROOTS/root"));
const product_model_1 = require("../../../models/products/product.model");
const getAllProducts = async (_, res, next) => {
    try {
        const products = await product_model_1.Product.find().sort({ createdAt: -1 });
        res.status(200).json({
            products,
        });
    }
    catch (error) {
        console.error('Error fetching products:', error); // Log internally
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500));
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return next(new root_1.default("Product ID is required", root_1.ErrorCodes.MISSING_REQUIRED_FIELDS, 422));
        }
        const product = await product_model_1.Product.findById(id);
        if (!product) {
            return next(new root_1.default("Product not found", root_1.ErrorCodes.PRODUCT_NOT_FOUND, 404));
        }
        return res.status(200).json(product);
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.getProductById = getProductById;
