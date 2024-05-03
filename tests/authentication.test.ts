import { describe, expect, it } from "bun:test";
import supertest from "supertest";
import { app } from "../index";

const staticJwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTE2MjM5MDIyfQ.wWIr5eSkGvY44wLb5JEs10CxPBnqWp4F1ns7zh8Qpes";

describe("Authentication", () => {
  it("register path return 200", async () => {
    const response = await supertest(app).post("/auth/register").send({
      full_name: "Syahrul Safarila",
      email: "sysafarila.official@gmail.com",
      password: "password",
      password_confirmation: "password",
    });

    expect(response.status).toBe(200);
  });

  it("register path return 400", async () => {
    const response = await supertest(app).post("/auth/register").send({
      full_name: "Syahrul Safarila",
      email: "sysafarila.official@gmail.com",
      password: "password",
    });

    expect(response.status).toBe(400);
  });

  it("login path return 200", async () => {
    const response = await supertest(app).post("/auth/login").send({
      email: "sysafarila.official@gmail.com",
      password: "password",
    });

    expect(response.status).toBe(200);
  });

  it("login path return 400", async () => {
    const response = await supertest(app).post("/auth/login").send({
      email: "sysafarila.official@gmail.com",
    });

    expect(response.status).toBe(400);
  });

  it("logout path return 200", async () => {
    const response = await supertest(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${staticJwtToken}`);

    expect(response.status).toBe(200);
  });

  it("logout path return 401", async () => {
    const response = await supertest(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer another token`);

    expect(response.status).toBe(401);
  });
});
