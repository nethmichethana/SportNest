import { Router } from "express";
import {createProduct,getAllProducts,} from "../controllers/productController";

const router = Router();

router.post("/", createProduct);

router.get("/", getAllProducts);

export default router;