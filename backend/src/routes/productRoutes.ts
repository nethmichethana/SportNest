
import { Router } from "express";

import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllProducts);

router.post("/", protect, adminOnly, createProduct);

router.put("/:id", protect, adminOnly, updateProduct);

router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
