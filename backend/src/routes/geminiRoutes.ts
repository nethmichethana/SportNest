import { Router } from "express";
import { chatWithGemini } from "../controllers/geminiController";

const router = Router();

router.post("/chat", chatWithGemini);

export default router;