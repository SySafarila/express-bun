import { describe, expect, it } from "bun:test";
import supertest from "supertest";
import { app } from "../index";

let testToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTE2MjM5MDIyfQ.wWIr5eSkGvY44wLb5JEs10CxPBnqWp4F1ns7zh8Qpes";

describe("Roles", () => {
  it("role store return 200", async () => {
    const responseLogin = await supertest(app).post("/auth/login").send({
      email: "test@test.com",
      password: "password",
    });
    testToken = responseLogin.body.token;

    expect(responseLogin.status).toBe(200);

    const response200 = await supertest(app)
      .post("/admin/roles")
      .send({
        name: "super admin",
      })
      .set("Authorization", `Bearer ${testToken}`);

    expect(response200.status).toBe(200);
    const response400 = await supertest(app)
      .post("/admin/roles")
      .send({
        name: "super admin",
      })
      .set("Authorization", `Bearer ${testToken}`);

    expect(response400.status).toBe(400);
  });
});
