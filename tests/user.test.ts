import { describe, expect, it } from "bun:test";
import supertest from "supertest";
import { app } from "../index";

let testToken = "";

describe("user path", () => {
  it("user synch roles path return 200", async () => {
    const responseLogin = await supertest(app).post("/auth/login").send({
      email: "super.admin@admin.com",
      password: "password",
    });
    testToken = responseLogin.body.token;

    expect(responseLogin.status).toBe(200);

    const responseSynch = await supertest(app)
      .post("/user/synch-roles")
      .send({
        user_id: 2,
        roles: [1],
      })
      .set("Authorization", `Bearer ${testToken}`);

    expect(responseSynch.status).toBe(200);
  });
});
