import { db } from "../db";
import { users } from "../db/schema";
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
};
