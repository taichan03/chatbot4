import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX!",
  });
});

app.post("/sixer/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const messages = prompt.map((message, index) => {
      if (index % 2 === 0) {
        // If the index is even, set the role as "system"
        return { role: "system", content: message.content };
      } else {
        // If the index is odd, set the role as "user"
        return { role: "user", content: message.content };
      }
    });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    res.status(200).send({
      bot: response.data.choices[0].message,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(5000);
