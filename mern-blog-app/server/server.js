const postRoutes = require("./routes/postRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use("/api/posts", postRoutes);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message is required."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an AI Blog Assistant for a MERN stack blog application.

Help users:
- Generate blog ideas
- Create blog titles
- Summarize blog content
- Explain MERN stack concepts
- Improve writing

Keep answers short, clear, and student-friendly.

User message:
${message}
`
    });

    res.json({
      reply: response.text
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      reply: "AI chatbot is temporarily unavailable. Please try again."
    });
  }
});

app.get("/", (req, res) => {
  res.send("MERN Blog API Running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});