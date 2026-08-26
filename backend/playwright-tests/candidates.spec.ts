import { test, expect } from "@playwright/test";

let candidateId: string;
let authToken: string;

test.describe.serial("Candidates API", () => {
  test("registers a candidate", async ({ request }) => {
    const response = await request.post("/candidates/register", {
      data: {
        email: `pw-test-${Date.now()}@example.com`,
        password: "TestPassword123!",
        firstName: "Playwright",
        lastName: "Test",
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.candidate.id).toBeDefined();
    expect(body.candidate.isActive).toBe(true);
    expect(body.token).toBeDefined();

    candidateId = body.candidate.id;
    authToken = body.token;
  });

  test("logs in with the correct password", async ({ request }) => {
    const email = `pw-login-${Date.now()}@example.com`;
    await request.post("/candidates/register", {
      data: {
        email,
        password: "TestPassword123!",
        firstName: "Login",
        lastName: "Test",
      },
    });

    const response = await request.post("/candidates/login", {
      data: { email, password: "TestPassword123!" },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeDefined();
  });

  test("rejects login with the wrong password", async ({ request }) => {
    const email = `pw-wrongpass-${Date.now()}@example.com`;
    await request.post("/candidates/register", {
      data: {
        email,
        password: "TestPassword123!",
        firstName: "Wrong",
        lastName: "Pass",
      },
    });

    const response = await request.post("/candidates/login", {
      data: { email, password: "IncorrectPassword" },
    });

    expect(response.status()).toBe(401);
  });

  test("gets all active candidates", async ({ request }) => {
    const response = await request.get("/candidates");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("gets a candidate by id", async ({ request }) => {
    const response = await request.get(`/candidates/${candidateId}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(candidateId);
  });

  test("returns 404 for a nonexistent candidate id", async ({ request }) => {
    const response = await request.get("/candidates/nonexistent-id-12345");
    expect(response.status()).toBe(404);
  });

  test("rejects an update without an auth token", async ({ request }) => {
    const response = await request.put(`/candidates/${candidateId}`, {
      data: {
        email: `pw-updated-${Date.now()}@example.com`,
        firstName: "Updated",
        lastName: "Name",
        headline: "Senior Automated QA",
        summary: "Updated by Playwright.",
      },
    });

    expect(response.status()).toBe(401);
  });

  test("updates a candidate with a valid auth token", async ({ request }) => {
    const response = await request.put(`/candidates/${candidateId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        email: `pw-updated-${Date.now()}@example.com`,
        firstName: "Updated",
        lastName: "Name",
        headline: "Senior Automated QA",
        summary: "Updated by Playwright.",
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstName).toBe("Updated");
  });

  test("disables a candidate", async ({ request }) => {
    const response = await request.patch(`/candidates/${candidateId}/disable`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isActive).toBe(false);
  });

  test("excludes disabled candidates from active list", async ({ request }) => {
    const response = await request.get("/candidates");
    const body = await response.json();
    const found = body.find((c: any) => c.id === candidateId);
    expect(found).toBeUndefined();
  });

  test("re-enables a candidate", async ({ request }) => {
    const response = await request.patch(`/candidates/${candidateId}/enable`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isActive).toBe(true);
  });
});