import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";

export const usersService = {
  /**
   * Mendaftarkan pengguna baru ke dalam database.
   * Melakukan pengecekan duplikasi email dan hashing password sebelum disimpan.
   */
  async registerUser(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;

    // 1. Cek apakah email sudah terdaftar di database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { error: "email sudah terdaftar" };
    }

    // 2. Hash password menggunakan bcrypt bawaan dari Bun
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // 3. Simpan data pengguna baru ke database
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return { data: "OK" };
  },

  /**
   * Melakukan proses otentikasi pengguna.
   * Mengecek ketersediaan email, memverifikasi password, dan membuat sesi baru.
   */
  async loginUser(data: { email: string; password: string }) {
    const { email, password } = data;

    // 1. Cari pengguna berdasarkan email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return { error: "email atau password salah" };
    }

    // 2. Verifikasi kecocokan password plaintext dengan hash di database
    const isPasswordValid = await Bun.password.verify(password, user.password);
    if (!isPasswordValid) {
      return { error: "email atau password salah" };
    }

    // 3. Buat token sesi baru (menggunakan UUID) dan simpan ke database
    const token = crypto.randomUUID();
    await db.insert(sessions).values({
      token,
      userId: user.id,
    });

    return { data: token };
  },

  /**
   * Mengambil data profil pengguna yang sedang login berdasarkan token sesi.
   */
  async getCurrentUser(token: string) {
    // 1. Cari sesi berdasarkan token, lalu lakukan INNER JOIN dengan tabel pengguna (users)
    // untuk mendapatkan detail profil pengguna terkait
    const result = await db
      .select({
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
        },
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.token, token))
      .limit(1)
      .then((rows) => rows[0]);

    // 2. Jika sesi tidak ditemukan atau tidak valid, tolak akses
    if (!result) {
      return { error: "Unauthorized" };
    }

    return { data: result.user };
  },

  /**
   * Melakukan proses logout dengan cara menghapus token sesi dari database.
   */
  async logoutUser(token: string) {
    // 1. Hapus baris di tabel sessions yang memiliki token yang cocok
    const result = await db
      .delete(sessions)
      .where(eq(sessions.token, token));

    // 2. Jika tidak ada baris yang terhapus (token tidak ada di DB), kembalikan error
    if (result[0].affectedRows === 0) {
      return { error: "Unauthorized" };
    }

    return { data: "oke" };
  },
};
