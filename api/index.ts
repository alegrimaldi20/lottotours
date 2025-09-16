import express from "express";
import serverless from "serverless-http";

const app = express();

// Ejemplo API
app.get("/hello", (req, res) => {
  res.json({ message: "Hola desde Express en Vercel 🚀" });
});

export default serverless(app);

