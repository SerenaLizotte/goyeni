import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app";
import { prisma } from "../app";

let createdCandidateId: string;
let authToken: string;

describe("Candidates API", () => {
  it("registers a candidate", async () => {
    const response = await request(app).post("/candidates/register").send({
      email: `test-${Date.now()}@example.com`,
      password: "TestPassword123!",
      firstName: "Test",
      lastName: "Candidate",
    });

    expect(response.status).toBe(201);
    expect(response.body.candidate.id).toBeDefined();
    expect(response.body.candidate.isActive).toBe(true);
    expect(response.body.token).toBeDefined();

    createdCandidateId = response.body.candidate.id;
    authToken = response.body.token;
  });

  it("logs in with the correct password", async () => {
    const email = `login-test-${Date.now()}@example.com`;
    await request(app).post("/candidates/register").send({
      email,
      password: "TestPassword123!",
      firstName: "Login",
      lastName: "Test",
    });

    const response = await request(app).post("/candidates/login").send({
      email,
      password: "TestPassword123!",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("rejects login with the wrong password", async () => {
    const email = `wrongpass-${Date.now()}@example.com`;
    await request(app).post("/candidates/register").send({
      email,
      password: "TestPassword123!",
      firstName: "Wrong",
      lastName: "Pass",
    });

    const response = await request(app).post("/candidates/login").send({
      email,
      password: "IncorrectPassword",
    });

    expect(response.status).toBe(401);
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

  it("rejects an update without an auth token", async () => {
    const response = await request(app)
      .put(`/candidates/${createdCandidateId}`)
      .send({
        email: `updated-${Date.now()}@example.com`,
        firstName: "Updated",
        lastName: "Name",
        headline: "Senior QA Engineer",
        summary: "Updated summary.",
      });

    expect(response.status).toBe(401);
  });

  it("updates a candidate with a valid auth token", async () => {
    const response = await request(app)
      .put(`/candidates/${createdCandidateId}`)
      .set("Authorization", `Bearer ${authToken}`)
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