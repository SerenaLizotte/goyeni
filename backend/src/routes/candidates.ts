import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";
import type { AuthedRequest } from "../middleware/auth";

const router = Router();

function toPublicCandidate(candidate: any) {
  const { passwordHash, ...publicFields } = candidate;
  return publicFields;
}

function issueToken(candidateId: string) {
  return jwt.sign({ candidateId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

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
  res.json(candidates.map(toPublicCandidate));
});

/**
 * @openapi
 * /candidates/register:
 *   post:
 *     summary: Register a new candidate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Candidate created
 *       409:
 *         description: Email already registered
 */
router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const existing = await prisma.candidate.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const candidate = await prisma.candidate.create({
    data: {
      email,
      passwordHash,
      firstName: firstName || "New",
      lastName: lastName || "Candidate",
    },
  });

  const token = issueToken(candidate.id);
  res.status(201).json({ candidate: toPublicCandidate(candidate), token });
});

/**
 * @openapi
 * /candidates/login:
 *   post:
 *     summary: Log in a candidate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const candidate = await prisma.candidate.findUnique({ where: { email } });
  if (!candidate) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, candidate.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = issueToken(candidate.id);
  res.json({ candidate: toPublicCandidate(candidate), token });
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
    include: { workExperiences: { orderBy: { startDate: "desc" } } },
  });
  if (!candidate) {
    return res.status(404).json({ error: "Candidate not found" });
  }
  res.json(toPublicCandidate(candidate));
});

/**
 * @openapi
 * /candidates/{id}:
 *   put:
 *     summary: Update a candidate (requires authentication)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Candidate updated
 *       403:
 *         description: Not authorized to update this candidate
 *       404:
 *         description: Candidate not found
 */
router.put("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const candidateId = req.params.id;
  if (!candidateId || req.candidateId !== candidateId) {
    return res.status(403).json({ error: "Not authorized to update this candidate" });
  }

  const { email, firstName, lastName, headline, summary } = req.body;
  try {
    const candidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: { email, firstName, lastName, headline, summary },
    });
    res.json(toPublicCandidate(candidate));
  } catch (error) {
    res.status(404).json({ error: "Candidate not found" });
  }
});

/**
 * @openapi
 * /candidates/{id}/password:
 *   put:
 *     summary: Change a candidate's password (requires authentication)
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
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       401:
 *         description: Current password is incorrect
 *       403:
 *         description: Not authorized to update this candidate
 */
router.put("/:id/password", requireAuth, async (req: AuthedRequest, res) => {
  const candidateId = req.params.id;
  if (!candidateId || req.candidateId !== candidateId) {
    return res.status(403).json({ error: "Not authorized to update this candidate" });
  }

  const { currentPassword, newPassword } = req.body;

  const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
  if (!candidate) {
    return res.status(404).json({ error: "Candidate not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, candidate.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.candidate.update({
    where: { id: candidateId },
    data: { passwordHash },
  });

  res.json({ message: "Password updated" });
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
    res.json(toPublicCandidate(candidate));
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
    res.json(toPublicCandidate(candidate));
  } catch (error) {
    res.status(404).json({ error: "Candidate not found" });
  }
});

export default router;