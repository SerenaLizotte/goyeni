import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/candidates", async (req, res) => {
  const candidates = await prisma.candidate.findMany();
  res.json(candidates);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});