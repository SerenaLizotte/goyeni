import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app";
import { prisma } from "../app";

let createdCandidateId: string;

describe("Candidates API", () => {
  it("creates a candidate", async () => {
    const response = await request(app).post("/candidates").send({
      email: `test-${Date.now()}@example.com`,
      firstName: "Test",
      lastName: "Candidate",
      headline: "QA Engineer",
      summary: "A test candidate created by Vitest.",
    });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.isActive).toBe(true);

    createdCandidateId = response.body.id;
  });

  it("gets all active candidates", async () => {
    const response = await request(app).get("/candidates");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("gets a candidate by id", async () => {
    const response = await request(app).get(`/candidates/${createdCandidateId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdCandidateId);
  });

  it("returns 404 for a nonexistent candidate id", async () => {
    const response = await request(app).get("/candidates/nonexistent-id-12345");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Candidate not found");
  });

  it("updates a candidate", async () => {
    const response = await request(app)
      .put(`/candidates/${createdCandidateId}`)
      .send({
        email: `updated-${Date.now()}@example.com`,
        firstName: "Updated",
        lastName: "Name",
        headline: "Senior QA Engineer",
        summary: "Updated summary.",
      });

    expect(response.status).toBe(200);
    expect(response.body.firstName).toBe("Updated");
  });

  it("disables a candidate", async () => {
    const response = await request(app).patch(
      `/candidates/${createdCandidateId}/disable`
    );
    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(false);
  });

  it("excludes disabled candidates from the active list", async () => {
    const response = await request(app).get("/candidates");
    const found = response.body.find((c: any) => c.id === createdCandidateId);
    expect(found).toBeUndefined();
  });

  it("re-enables a candidate", async () => {
    const response = await request(app).patch(
      `/candidates/${createdCandidateId}/enable`
    );
    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(true);
  });
});
