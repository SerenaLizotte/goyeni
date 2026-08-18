import { test, expect } from "@playwright/test";

let candidateId: string;

test.describe.serial("Candidates API", () => {
  test("creates a candidate", async ({ request }) => {
    const response = await request.post("/candidates", {
      data: {
        email: `pw-test-${Date.now()}@example.com`,
        firstName: "Playwright",
        lastName: "Test",
        headline: "Automated QA",
        summary: "Created by Playwright API test.",
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.isActive).toBe(true);

    candidateId = body.id;
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

  test("updates a candidate", async ({ request }) => {
    const response = await request.put(`/candidates/${candidateId}`, {
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
