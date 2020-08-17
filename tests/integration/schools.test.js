const request = require("supertest");
const { School } = require("../../models/school");
const { User } = require("../../models/user");
const mongoose = require("mongoose");
let server;

describe("/api/schools", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await School.deleteMany({});
    server.close();
  });

  describe("GET /", () => {
    it("should return all schools", async () => {
      await School.collection.insertMany([
        { name: "school1" },
        { name: "school2" },
      ]);
      const res = await request(server).get("/api/schools");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((s) => s.name === "school1")).toBeTruthy();
      expect(res.body.some((s) => s.name === "school2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a school if valid id is passed", async () => {
      const school = new School({ name: "school1" });
      await school.save();

      const res = await request(server).get("/api/schools/" + school._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", school.name);
    });

    it("should return 404 if invalid ID is passed", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/schools/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/schools")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "school1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if school is less than 5 characters", async () => {
      name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if school is more than 50 characters", async () => {
      name = new Array(100).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save the school if it is valid", async () => {
      await exec();
      const school = await School.find({ name: "school1" });
      expect(school).not.toBeNull();
    });

    it("should return the school if it is valid", async () => {
      const res = await exec();
      const school = await School.find({ name: "school1" });
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "school1");
    });
  });
});
