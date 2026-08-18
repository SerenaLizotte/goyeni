import { Router } from "express";
import { prisma } from "../db";

const router = Router();

/**
 * @openapi
 * /employers:
 *   get:
 *     summary: Get all employers
 *     responses:
 *       200:
 *         description: List of employers
 */
router.get("/", async (req, res) => {
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
router.post("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
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
router.put("/:id", async (req, res) => {
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
router.patch("/:id/disable", async (req, res) => {
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
router.patch("/:id/enable", async (req, res) => {
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

export default router;
