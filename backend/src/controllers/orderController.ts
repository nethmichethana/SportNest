
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import mongoose from "mongoose";
import Order from "../models/Order";
import Product from "../models/Product";

export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { customerName, email, phone, address, items } = req.body;

    if (!customerName || !email || !phone || !address) {
      res.status(400).json({
        success: false,
        message: "Please provide all customer details.",
      });
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
      return;
    }

    let totalAmount = 0;
    const orderItems = [];


    for (const item of items) {
      if (
        !mongoose.Types.ObjectId.isValid(item.productId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid product or quantity.",
        });
        return;
      }

      const product = await Product.findById(item.productId);

      if (!product || !product.isActive) {
        res.status(404).json({
          success: false,
          message: "Product not found or unavailable.",
        });
        return;
      }

      if (product.stockQuantity < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}.`,
        });
        return;
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
       userId: req.user!.userId,
      customerName,
      email,
      phone,
      address,
      items: orderItems,
      totalAmount,
    });


    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order.",
    });
  }
};



export const getMyOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find({
      userId: req.user!.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "My orders retrieved successfully.",
      data: orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders.",
    });
  }
};
