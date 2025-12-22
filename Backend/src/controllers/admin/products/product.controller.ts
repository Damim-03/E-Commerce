import cloudinary from "../../../config/cloudinary";
import { BadRequestsException } from "../../../helpers/BAD-REQ/Bad-request";
import { NotFoundException } from "../../../helpers/NOT-FOUND/not-found";
import { ErrorCodes } from "../../../helpers/ROOTS/root";
import { Product } from "../../../models/products/product.model";

export const createProduct = async (req: any, res: any) => {
  const { name, description, price, category, stock } = req.body;

  if (!name || !description || !price || !category || !stock) {
    throw new BadRequestsException(
      "All fields are required",
      ErrorCodes.UNPROCESSABLE_ENTITY
    );
  }

  if (!req.files || req.files.length === 0) {
    throw new BadRequestsException(
      "At least one image is required",
      ErrorCodes.UNPROCESSABLE_ENTITY
    );
  }

  if (req.files.length > 3) {
    throw new BadRequestsException(
      "A maximum of 3 images are allowed",
      ErrorCodes.UNPROCESSABLE_ENTITY
    );
  }

  const uploadResults = await Promise.all(
    (req.files as any[]).map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "products",
      })
    )
  );

  const imagesUrls = uploadResults.map((r) => r.secure_url);

  const product = await Product.create({
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

export const getAllProducts = async (_: any, res: any) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({
    products,
  });
};

export const updateProduct = async (req: any, res: any) => {
  const { id } = req.params;
  const { name, description, price, category, stock } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundException(
      "Product not found",
      ErrorCodes.PRODUCT_NOT_FOUND
    );
  }

  if (name) product.name = name;
  if (description) product.description = description;
  if (price !== undefined) product.price = parseFloat(price);
  if (stock !== undefined) product.stock = parseInt(stock);
  if (category) product.category = category;

  if (req.files && req.files.length > 0) {
    if (req.files.length > 3) {
      throw new BadRequestsException(
        "A maximum of 3 images are allowed",
        ErrorCodes.UNPROCESSABLE_ENTITY
      );
    }

    const uploadResults = await Promise.all(
      (req.files as any[]).map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "products",
        })
      )
    );

    product.images = uploadResults.map((r) => r.secure_url);
  }

  await product.save();

  res.status(200).json({
    message: "Product updated successfully",
    product,
  });
};

export const deleteProduct = async (req: any, res: any) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundException(
      "Product not found",
      ErrorCodes.PRODUCT_NOT_FOUND
    );
  }

  // 🔥 حذف الصور من Cloudinary
  if (product.images && product.images.length > 0) {
    await Promise.allSettled(
      product.images.map((img: any) =>
        cloudinary.uploader.destroy(img.public_id)
      )
    );
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product deleted successfully",
  });
};