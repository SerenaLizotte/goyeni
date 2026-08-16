import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const adapter = new PrismaPg({
  host: "dpg-da105mugekts73fvavl0-a.oregon-postgres.render.com",
  port: 5432,
  user: "goyenni_user",
  password: process.env.DB_PASSWORD,
  database: "goyenni",
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 4000;

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Goyeni API",
      version: "1.0.0",
      description: "API documentation for the Goyeni platform",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ["./src/index.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/**
 * @openapi
 * /candidates:
 *   get:
 *     summary: Get all candidates
 *     responses:
 *       200:
 *         description: List of candidates
 */
app.get("/candidates", async (req, res) => {
  const candidates = await prisma.candidate.findMany();
  res.json(candidates);
});

/**
 * @openapi
 * /candidates:
 *   post:
 *     summary: Create a candidate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               headline:
 *                 type: string
 *               summary:
 *                 type: string
 *     responses:
 *       201:
 *         description: Candidate created
 */
app.post("/candidates", async (req, res) => {
  const { email, firstName, lastName, headline, summary } = req.body;
  const candidate = await prisma.candidate.create({
    data: { email, firstName, lastName, headline, summary },
  });
  res.status(201).json(candidate);
});

/**
 * @openapi
 * /candidates/{id}:
 *   get:
 *     summary: Get a candidate by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidate found
 *       404:
 *         description: Candidate not found
 */
app.get("/candidates/:id", async (req, res) => {
  const candidate = await prisma.candidate.findUnique({
    where: { id: req.params.id },
  });
  if (!candidate) {
    return res.status(404).json({ error: "Candidate not found" });
  }
  res.json(candidate);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});