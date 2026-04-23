import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";

export const usersService = {
  async registerUser(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { error: "email sudah terdaftar" };
    }

    // Hash password
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // Save user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return { data: "OK" };
  },

  async loginUser(data: { email: string; password: string }) {
    const { email, password } = data;

    // Find user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return { error: "email atau password salah" };
    }

    // Verify password
    const isPasswordValid = await Bun.password.verify(password, user.password);
    if (!isPasswordValid) {
      return { error: "email atau password salah" };
    }

    // Create session
    const token = crypto.randomUUID();
    await db.insert(sessions).values({
      token,
      userId: user.id,
    });

    return { data: token };
  },
};
