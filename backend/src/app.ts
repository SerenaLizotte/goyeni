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
export const prisma = new PrismaClient({ adapter });
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
  apis: ["./src/app.ts"],
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
  const candidates = await prisma.candidate.findMany({
    where: { isActive: true },
  });
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

/**
 * @openapi
 * /candidates/{id}:
 *   put:
 *     summary: Update a candidate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *       200:
 *         description: Candidate updated
 *       404:
 *         description: Candidate not found
 */
app.put("/candidates/:id", async (req, res) => {
  const { email, firstName, lastName, headline, summary } = req.body;
  try {
    const candidate = await prisma.candidate.update({
      where: { id: req.params.id },
      data: { email, firstName, lastName, headline, summary },
    });
    res.json(candidate);
  } catch (error) {
    res.status(404).json({ error: "Candidate not found" });
  }
});

/**
 * @openapi
 * /candidates/{id}/disable:
 *   patch:
 *     summary: Disable a candidate (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidate disabled
 *       404:
 *         description: Candidate not found
 */
app.patch("/candidates/:id/disable", async (req, res) => {
  try {
    const candidate = await prisma.candidate.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json(candidate);
  } catch (error) {
    res.status(404).json({ error: "Candidate not found" });
  }
});

/**
 * @openapi
 * /candidates/{id}/enable:
 *   patch:
 *     summary: Enable a candidate
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidate enabled
 *       404:
 *         description: Candidate not found
 */
app.patch("/candidates/:id/enable", async (req, res) => {
  try {
    const candidate = await prisma.candidate.update({
      where: { id: req.params.id },
      data: { isActive: true },
    });
    res.json(candidate);
  } catch (error) {
    res.status(404).json({ error: "Candidate not found" });
  }
});

/**
 * @openapi
 * /employers:
 *   get:
 *     summary: Get all employers
 *     responses:
 *       200:
 *         description: List of employers
 */
app.get("/employers", async (req, res) => {
  const employers = await prisma.employer.findMany({
    where: { isActive: true },
  });
  res.json(employers);
});

/**
 * @openapi
 * /employers:
 *   post:
 *     summary: Create an employer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               companyName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employer created
 */
app.post("/employers", async (req, res) => {
  const { email, companyName } = req.body;
  const employer = await prisma.employer.create({
    data: { email, companyName },
  });
  res.status(201).json(employer);
});

/**
 * @openapi
 * /employers/{id}:
 *   get:
 *     summary: Get an employer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employer found
 *       404:
 *         description: Employer not found
 */
app.get("/employers/:id", async (req, res) => {
  const employer = await prisma.employer.findUnique({
    where: { id: req.params.id },
  });
  if (!employer) {
    return res.status(404).json({ error: "Employer not found" });
  }
  res.json(employer);
});

/**
 * @openapi
 * /employers/{id}:
 *   put:
 *     summary: Update an employer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               companyName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employer updated
 *       404:
 *         description: Employer not found
 */
app.put("/employers/:id", async (req, res) => {
  const { email, companyName } = req.body;
  try {
    const employer = await prisma.employer.update({
      where: { id: req.params.id },
      data: { email, companyName },
    });
    res.json(employer);
  } catch (error) {
    res.status(404).json({ error: "Employer not found" });
  }
});

/**
 * @openapi
 * /employers/{id}/disable:
 *   patch:
 *     summary: Disable an employer (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employer disabled
 *       404:
 *         description: Employer not found
 */
app.patch("/employers/:id/disable", async (req, res) => {
  try {
    const employer = await prisma.employer.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json(employer);
  } catch (error) {
    res.status(404).json({ error: "Employer not found" });
  }
});

/**
 * @openapi
 * /employers/{id}/enable:
 *   patch:
 *     summary: Enable an employer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employer enabled
 *       404:
 *         description: Employer not found
 */
app.patch("/employers/:id/enable", async (req, res) => {
  try {
    const employer = await prisma.employer.update({
      where: { id: req.params.id },
      data: { isActive: true },
    });
    res.json(employer);
  } catch (error) {
    res.status(404).json({ error: "Employer not found" });
  }
});

export default app;
