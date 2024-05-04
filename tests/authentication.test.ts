import { $ } from "bun";
import { describe, expect, it } from "bun:test";
import supertest from "supertest";
import { app } from "../index";

let testToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTE2MjM5MDIyfQ.wWIr5eSkGvY44wLb5JEs10CxPBnqWp4F1ns7zh8Qpes";

describe("Authentication", () => {
  it("register path return 200", async () => {
    if (
      Bun.env.PRODUCTION === "false" &&
      Bun.env.RESET_DATABASE_ON_TEST === "true"
    ) {
      await $`bunx prisma migrate reset -f`;
    }

    const response = await supertest(app).post("/auth/register").send({
      full_name: "Syahrul Safarila",
      email: "test@test.com",
      password: "password",
      password_confirmation: "password",
    });

    expect(response.status).toBe(200);
  });

  it("register path return 400", async () => {
    const response = await supertest(app).post("/auth/register").send({
      full_name: "Syahrul Safarila",
      email: "test@test.com",
      password: "password",
    });

    expect(response.status).toBe(400);
  });

  it("login path return 200", async () => {
    const response = await supertest(app).post("/auth/login").send({
      email: "test@test.com",
      password: "password",
    });
    testToken = response.body.token;

    expect(response.status).toBe(200);
  });

  it("login path return 400", async () => {
    const response = await supertest(app).post("/auth/login").send({
      email: "test@test.com",
    });
    const response2 = await supertest(app).post("/auth/login").send({
      email: "test@test.com",
      password: "another password",
    });

    expect(response.status).toBe(400);
    expect(response2.status).toBe(400);
  });

  it("logout path return 200", async () => {
    const response = await supertest(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
  });

  it("logout path return 401", async () => {
    const response = await supertest(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer another token`);
    const response2 = await supertest(app).post("/auth/logout");

    expect(response.status).toBe(401);
    expect(response2.status).toBe(401);
  });
});
