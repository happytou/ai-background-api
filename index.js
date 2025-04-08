require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

function getTimeMood() {
  const hour = new Date().getHours();
  if (hour < 12) return "bright morning";
  if (hour < 18) return "clear afternoon";
  if (hour < 21) return "sunset glow";
  return "calm starry night";
}

function getThemePrompt(theme) {
  switch (theme) {
    case "space": return "cartoon-style space with planets and stars";
    case "cyberpunk": return "cyberpunk city with neon lights";
    case "future": return "futuristic cartoon city with flying cars";
    default: return "sci-fi cartoon world";
  }
}

app.post("/generate-background", async (req, res) => {
  const theme = req.body.theme || "space";
  const mood = getTimeMood();
  const prompt = `${getThemePrompt(theme)}, ${mood}, digital illustration`;

  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });
    res.json({ imageUrl: response.data.data[0].url, prompt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
