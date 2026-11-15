import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const chatWithGemini = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({
        success: false,
        message: "Please enter a message.",
      });
      return;
    }

    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: message,
      system_instruction:
        "You are SportNest AI Assistant, a helpful sports shopping assistant. Help customers with football, cricket, fitness and basketball equipment. Give friendly, simple and useful answers. Do not invent SportNest product prices or stock availability.",
    });

    res.status(200).json({
      success: true,
      reply: interaction.output_text,
    });
  } catch (error) {
    console.error("Gemini AI Error:", error);

    res.status(500).json({
      success: false,
      message: "AI assistant is temporarily unavailable. Please try again.",
    });
  }
};