const { User } = require("../../models/user");
const { School } = require("../../models/school");
const request = require("supertest");
const mongoose = require("mongoose");
let server;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await School.deleteMany({});
    server.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/schools")
      .set("x-auth-token", token)
      .send({ name: "school1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
