import { describe, it, expect, beforeEach } from "bun:test";
import { Elysia } from "elysia";
import { usersRoute } from "../src/routes/users-route";
import { db } from "../src/db";
import { users, sessions } from "../src/db/schema";

const app = new Elysia().use(usersRoute);

describe("Users API", () => {
  beforeEach(async () => {
    // Clean database before each test
    await db.delete(sessions);
    await db.delete(users);
  });

  describe("POST /api/users (Registration)", () => {
    it("should register a new user successfully", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
          }),
        })
      );

      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.data).toBe("OK");
    });

    it("should return 400 if email is already registered", async () => {
      // Pre-register a user
      await db.insert(users).values({
        name: "Existing User",
        email: "test@example.com",
        password: "hashed_password",
      });

      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "New User",
            email: "test@example.com",
            password: "password123",
          }),
        })
      );

      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.error).toBe("email sudah terdaftar");
    });

    it("should return 422 for invalid email format", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: "invalid-email",
            password: "password123",
          }),
        })
      );

      expect(response.status).toBe(422);
    });

    it("should return 422 for name > 255 characters", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "A".repeat(256),
            email: "test@example.com",
            password: "password123",
          }),
        })
      );

      expect(response.status).toBe(422);
    });
  });

  describe("POST /api/login", () => {
    beforeEach(async () => {
      // Register a user for login tests
      const hashedPassword = await Bun.password.hash("password123", {
        algorithm: "bcrypt",
        cost: 10,
      });
      await db.insert(users).values({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      });
    });

    it("should login successfully with correct credentials", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        })
      );

      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.data).toBeDefined(); // Token
    });

    it("should return 401 for incorrect password", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            password: "wrongpassword",
          }),
        })
      );

      const body = await response.json();
      expect(response.status).toBe(401);
      expect(body.error).toBe("email atau password salah");
    });
  });

  describe("Authenticated Routes", () => {
    let token: string;

    beforeEach(async () => {
      // Register and login to get a token
      const hashedPassword = await Bun.password.hash("password123", {
        algorithm: "bcrypt",
        cost: 10,
      });
      const [user] = await db.insert(users).values({
        name: "Auth User",
        email: "auth@example.com",
        password: hashedPassword,
      });

      token = crypto.randomUUID();
      await db.insert(sessions).values({
        token,
        userId: user.insertId,
      });
    });

    it("should get current user with valid token", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/current", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.data.email).toBe("auth@example.com");
    });

    it("should return 401 for current user without token", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/current", {
          method: "GET",
        })
      );

      expect(response.status).toBe(401);
    });

    it("should logout successfully with valid token", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/logout", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.data).toBe("oke");

      // Verify token is gone
      const verifyRes = await app.handle(
        new Request("http://localhost/api/users/current", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      expect(verifyRes.status).toBe(401);
    });
  });
});
