import { Router } from "express";
import { prisma } from "../db";
import { requireAuth } from "../middleware/auth";
import type { AuthedRequest } from "../middleware/auth";

const router = Router();

function asString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

async function assertOwnsCandidate(candidateId: string, requesterId: string) {
  return candidateId === requesterId;
}

/**
 * @openapi
 * /candidates/{candidateId}/experience:
 *   post:
 *     summary: Add a work experience entry (requires authentication)
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Work experience created
 *       403:
 *         description: Not authorized
 */
router.post("/:candidateId/experience", requireAuth, async (req: AuthedRequest, res) => {
  const candidateId = asString(req.params.candidateId);
  if (!candidateId || !(await assertOwnsCandidate(candidateId, req.candidateId!))) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const { title, employer, city, state, startDate, endDate, description } = req.body;

  if (!title || !employer || !startDate) {
    return res.status(400).json({ error: "Title, employer, and start date are required" });
  }

  const experience = await prisma.workExperience.create({
    data: {
      candidateId,
      title,
      employer,
      city: city || null,
      state: state || null,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      description: description || null,
    },
  });

  res.status(201).json(experience);
});

/**
 * @openapi
 * /candidates/{candidateId}/experience/{experienceId}:
 *   put:
 *     summary: Update a work experience entry (requires authentication)
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: experienceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Work experience updated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Work experience not found
 */
router.put(
  "/:candidateId/experience/:experienceId",
  requireAuth,
  async (req: AuthedRequest, res) => {
    const candidateId = asString(req.params.candidateId);
    const experienceId = asString(req.params.experienceId);
    if (
      !candidateId ||
      !experienceId ||
      !(await assertOwnsCandidate(candidateId, req.candidateId!))
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { title, employer, city, state, startDate, endDate, description } = req.body;

        try {
      const experience = await prisma.workExperience.update({
        where: { id: experienceId, candidateId },
        data: {
          title,
          employer,
          city: city || null,
          state: state || null,
          ...(startDate ? { startDate: new Date(startDate) } : {}),
          endDate: endDate ? new Date(endDate) : null,
          description: description || null,
        },
      });
      res.json(experience);
    } catch (error) {
      res.status(404).json({ error: "Work experience not found" });
    }
  }
);

/**
 * @openapi
 * /candidates/{candidateId}/experience/{experienceId}:
 *   delete:
 *     summary: Delete a work experience entry (requires authentication)
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: experienceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Work experience deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Work experience not found
 */
router.delete(
  "/:candidateId/experience/:experienceId",
  requireAuth,
  async (req: AuthedRequest, res) => {
    const candidateId = asString(req.params.candidateId);
    const experienceId = asString(req.params.experienceId);
    if (
      !candidateId ||
      !experienceId ||
      !(await assertOwnsCandidate(candidateId, req.candidateId!))
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    try {
      await prisma.workExperience.delete({
        where: { id: experienceId, candidateId },
      });
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: "Work experience not found" });
    }
  }
);

export default router;