"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getAllProducts = exports.createProduct = void 0;
const cloudinary_1 = __importDefault(require("../../../config/cloudinary"));
const Bad_request_1 = require("../../../helpers/BAD-REQ/Bad-request");
const not_found_1 = require("../../../helpers/NOT-FOUND/not-found");
const root_1 = require("../../../helpers/ROOTS/root");
const product_model_1 = require("../../../models/products/product.model");
const createProduct = async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    if (!name || !description || !price || !category || !stock) {
        throw new Bad_request_1.BadRequestsException("All fields are required", root_1.ErrorCodes.UNPROCESSABLE_ENTITY);
    }
    if (!req.files || req.files.length === 0) {
        throw new Bad_request_1.BadRequestsException("At least one image is required", root_1.ErrorCodes.UNPROCESSABLE_ENTITY);
    }
    if (req.files.length > 3) {
        throw new Bad_request_1.BadRequestsException("A maximum of 3 images are allowed", root_1.ErrorCodes.UNPROCESSABLE_ENTITY);
    }
    const uploadResults = await Promise.all(req.files.map((file) => cloudinary_1.default.uploader.upload(file.path, {
        folder: "products",
    })));
    const imagesUrls = uploadResults.map((r) => r.secure_url);
    const product = await product_model_1.Product.create({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        images: imagesUrls,
    });
    res.status(201).json({
        message: "Product created successfully",
        product,
    });
};
exports.createProduct = createProduct;
const getAllProducts = async (_, res) => {
    const products = await product_model_1.Product.find().sort({ createdAt: -1 });
    res.status(200).json({
        products,
    });
};
exports.getAllProducts = getAllProducts;
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    const product = await product_model_1.Product.findById(id);
    if (!product) {
        throw new not_found_1.NotFoundException("Product not found", root_1.ErrorCodes.PRODUCT_NOT_FOUND);
    }
    if (name)
        product.name = name;
    if (description)
        product.description = description;
    if (price !== undefined)
        product.price = parseFloat(price);
    if (stock !== undefined)
        product.stock = parseInt(stock);
    if (category)
        product.category = category;
    if (req.files && req.files.length > 0) {
        if (req.files.length > 3) {
            throw new Bad_request_1.BadRequestsException("A maximum of 3 images are allowed", root_1.ErrorCodes.UNPROCESSABLE_ENTITY);
        }
        const uploadResults = await Promise.all(req.files.map((file) => cloudinary_1.default.uploader.upload(file.path, {
            folder: "products",
        })));
        product.images = uploadResults.map((r) => r.secure_url);
    }
    await product.save();
    res.status(200).json({
        message: "Product updated successfully",
        product,
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.Product.findById(id);
    if (!product) {
        throw new not_found_1.NotFoundException("Product not found", root_1.ErrorCodes.PRODUCT_NOT_FOUND);
    }
    // 🔥 حذف الصور من Cloudinary
    if (product.images && product.images.length > 0) {
        await Promise.allSettled(product.images.map((img) => cloudinary_1.default.uploader.destroy(img.public_id)));
    }
    await product.deleteOne();
    res.status(200).json({
        message: "Product deleted successfully",
    });
};
exports.deleteProduct = deleteProduct;
