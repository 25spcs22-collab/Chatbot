import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Gemini Chatbot Backend is running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    console.log("User message:", message);

   const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
  contents: message,
 config: {
  systemInstruction:
    "You are a friendly AI chat assistant. Talk naturally like a normal person. Keep every reply short and simple, usually 1 or 2 sentences. Avoid long explanations, headings, bullet points, and unnecessary details unless the user asks for them.",
  temperature: 0.7,
},
});

    const reply = response.text;

    console.log("Nova response:", reply);

    res.json({
      reply: reply,
    });
  } catch (error) {
    console.error("Nova API Error:");
    console.error(error);

    res.status(500).json({
      error: "Gemini API request failed",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});