import { Router } from "express";
import { prisma } from "../db";

const router = Router();

/**
 * @openapi
 * /candidates:
 *   get:
 *     summary: Get all candidates
 *     responses:
 *       200:
 *         description: List of candidates
 */
router.get("/", async (req, res) => {
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
router.post("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
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
router.put("/:id", async (req, res) => {
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
router.patch("/:id/disable", async (req, res) => {
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
router.patch("/:id/enable", async (req, res) => {
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

export default router;
