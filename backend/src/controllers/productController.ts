import { Request, Response } from "express";
import Product from "../models/Product";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      category,
      stockQuantity,
      imageUrl,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stockQuantity,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};


export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
    });
  }
};