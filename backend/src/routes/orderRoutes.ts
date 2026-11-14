
import { Router } from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);

router.get("/", protect, adminOnly, getAllOrders);

router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
