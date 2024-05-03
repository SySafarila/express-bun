import { describe, expect, it } from "bun:test";
import supertest from "supertest";
import { app } from "../index";

describe("Root path", () => {
  it("root path return 200", async () => {
    const response = await supertest(app).get("/");

    expect(response.status).toBe(200);
  });
});
