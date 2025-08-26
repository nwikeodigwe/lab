const Auth = require("../models/auth");
const app = require("../app.js");
const request = require("supertest");
const casual = require("casual");
const { status } = require("http-status");
const { HTTP_METHODS } = require("../constants");
const mongoose = require("mongoose");
let server;

describe("Auth Routes", () => {
  let user = {};
  let mockResponse;
  let response;
  let token;
  beforeAll(async () => {
    user.email = casual.email;
    user.password = casual.password;

    server = app.listen(0, () => {
      server.address().port;
    });

    response = (status, message) => {
      return {
        status: status,
        body: { message },
      };
    };

    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    await Auth.deleteMany({});
    await mongoose.disconnect();
    server.close();
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user and return a token", async () => {
      mockResponse = response(status.BAD_REQUEST, status[status.BAD_REQUEST]);

      jest
        .spyOn(request(server), HTTP_METHODS.POST)
        .mockReturnValue(mockResponse);

      const res = await request(server)
        .post("/api/auth/signup")
        .send({ email: user.email, password: user.password });
      expect(res.status).toBe(status.CREATED);
      expect(res.body).toHaveProperty("token");
    });

    it("should not allow duplicate emails", async () => {
      const res = await request(server)
        .post("/api/auth/signup")
        .send({ email: user.email, password: user.password });
      expect(res.status).toBe(status.CONFLICT);
      expect(res.body.message).toBe("User already exists");
    });
  });

  describe("POST /api/auth/signin", () => {
    it("should sign in an existing user and return a token", async () => {
      mockResponse = response(status.OK, status[status.OK]);

      jest
        .spyOn(request(server), HTTP_METHODS.POST)
        .mockReturnValue(mockResponse);

      const res = await request(server)
        .post("/api/auth/signin")
        .send({ email: user.email, password: user.password });
      expect(res.status).toBe(status.OK);
      expect(res.body).toHaveProperty("token");
    });

    it("should not sign in with invalid credentials", async () => {
      const res = await request(server)
        .post("/api/auth/signin")
        .send({ email: "", password: "" });
      expect([400, 404]).toContain(res.status);
    });
  });

  describe("POST /api/auth/reset", () => {
    it("should return 404 for non-existing user", async () => {
      const res = await request(server)
        .post("/api/auth/reset")
        .send({ email: casual.email });
      expect(res.status).toBe(status.NOT_FOUND);
      expect(res.body.message).toBe(status[status.NOT_FOUND]);
    });
  });
});
