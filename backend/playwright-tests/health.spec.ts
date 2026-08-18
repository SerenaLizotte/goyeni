import { test, expect } from "@playwright/test";

test.describe("Health API", () => {
  test("GET /health returns status ok", async ({ request }) => {
    const response = await request.get("/health");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ status: "ok" });
  });
});
