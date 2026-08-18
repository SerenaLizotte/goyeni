import { test, expect } from "@playwright/test";

let employerId: string;

test.describe.serial("Employers API", () => {
  test("creates an employer", async ({ request }) => {
    const response = await request.post("/employers", {
      data: {
        email: `pw-employer-${Date.now()}@example.com`,
        companyName: "Playwright Test Co",
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeDefined();
    expect(body.isActive).toBe(true);

    employerId = body.id;
  });

  test("gets all active employers", async ({ request }) => {
    const response = await request.get("/employers");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("gets an employer by id", async ({ request }) => {
    const response = await request.get(`/employers/${employerId}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(employerId);
  });

  test("returns 404 for a nonexistent employer id", async ({ request }) => {
    const response = await request.get("/employers/nonexistent-id-12345");
    expect(response.status()).toBe(404);
  });

  test("updates an employer", async ({ request }) => {
    const response = await request.put(`/employers/${employerId}`, {
      data: {
        email: `pw-employer-updated-${Date.now()}@example.com`,
        companyName: "Updated Company Name",
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.companyName).toBe("Updated Company Name");
  });

  test("disables an employer", async ({ request }) => {
    const response = await request.patch(`/employers/${employerId}/disable`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isActive).toBe(false);
  });

  test("excludes disabled employers from active list", async ({ request }) => {
    const response = await request.get("/employers");
    const body = await response.json();
    const found = body.find((e: any) => e.id === employerId);
    expect(found).toBeUndefined();
  });

  test("re-enables an employer", async ({ request }) => {
    const response = await request.patch(`/employers/${employerId}/enable`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isActive).toBe(true);
  });
});
