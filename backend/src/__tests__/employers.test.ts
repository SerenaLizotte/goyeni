import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

let createdEmployerId: string;

describe("Employers API", () => {
  it("creates an employer", async () => {
    const response = await request(app).post("/employers").send({
      email: `employer-${Date.now()}@example.com`,
      companyName: "Test Company",
    });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.isActive).toBe(true);

    createdEmployerId = response.body.id;
  });

  it("gets all active employers", async () => {
    const response = await request(app).get("/employers");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("gets an employer by id", async () => {
    const response = await request(app).get(`/employers/${createdEmployerId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdEmployerId);
  });

  it("returns 404 for a nonexistent employer id", async () => {
    const response = await request(app).get("/employers/nonexistent-id-12345");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Employer not found");
  });

  it("updates an employer", async () => {
    const response = await request(app)
      .put(`/employers/${createdEmployerId}`)
      .send({
        email: `updated-employer-${Date.now()}@example.com`,
        companyName: "Updated Company Name",
      });

    expect(response.status).toBe(200);
    expect(response.body.companyName).toBe("Updated Company Name");
  });

  it("disables an employer", async () => {
    const response = await request(app).patch(
      `/employers/${createdEmployerId}/disable`
    );
    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(false);
  });

  it("excludes disabled employers from the active list", async () => {
    const response = await request(app).get("/employers");
    const found = response.body.find((e: any) => e.id === createdEmployerId);
    expect(found).toBeUndefined();
  });

  it("re-enables an employer", async () => {
    const response = await request(app).patch(
      `/employers/${createdEmployerId}/enable`
    );
    expect(response.status).toBe(200);
    expect(response.body.isActive).toBe(true);
  });
});
