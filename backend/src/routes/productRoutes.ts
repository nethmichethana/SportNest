import { Router } from "express";
import {createProduct,getAllProducts, updateProduct,} from "../controllers/productController";

const router = Router();

router.post("/", createProduct);

router.get("/", getAllProducts);

router.put("/:id", updateProduct);

export default router;