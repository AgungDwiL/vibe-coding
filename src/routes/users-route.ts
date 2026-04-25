import { Elysia, t } from "elysia";
import { usersService } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api" })
  // Middleware untuk mengekstrak token Bearer dari header Authorization
  // Token ini akan di-*inject* ke semua endpoint di bawahnya melalui context `token`
  .derive(({ headers }) => {
    const authHeader = headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    return { token };
  })
  
  // Endpoint: Registrasi User Baru
  .post("/users", async ({ body, set }) => {
    const result = await usersService.registerUser(body);
    
    if (result.error) {
      set.status = 400; // Bad Request jika email sudah terdaftar
    }
    
    return result;
  }, {
    detail: {
      summary: "Registrasi User Baru",
      tags: ["Users"],
      description: "Mendaftarkan akun pengguna baru ke sistem."
    },
    // Validasi input body menggunakan TypeBox (t)
    body: t.Object({
      name: t.String({ maxLength: 255 }),
      email: t.String({ format: 'email', maxLength: 255 }),
      password: t.String({ maxLength: 255 }),
    })
  })
  
  // Endpoint: Login User
  .post("/login", async ({ body, set }) => {
    const result = await usersService.loginUser(body);
    
    if (result.error) {
      set.status = 401; // Unauthorized jika kredensial salah
    }
    
    return result;
  }, {
    detail: {
      summary: "Login User",
      tags: ["Auth"],
      description: "Melakukan login dan mengembalikan token sesi."
    },
    // Validasi input body untuk login
    body: t.Object({
      email: t.String({ format: 'email', maxLength: 255 }),
      password: t.String({ maxLength: 255 }),
    })
  })
  
  // Endpoint: Mendapatkan Data User yang Sedang Login
  // Membutuhkan token dari middleware .derive()
  .get("/users/current", async ({ token, set }) => {
    // Tolak request jika tidak ada token yang diberikan
    if (!token) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const result = await usersService.getCurrentUser(token);

    if (result.error) {
      set.status = 401; // Unauthorized jika token tidak valid/kadaluarsa
    }

    return result;
  }, {
    detail: {
      summary: "Get Current User",
      tags: ["Users"],
      description: "Mengambil data profil pengguna yang sedang login berdasarkan token sesi."
    }
  })
  
  // Endpoint: Logout User
  // Menghapus token dari database
  .delete("/users/logout", async ({ token, set }) => {
    // Tolak request jika tidak ada token yang diberikan
    if (!token) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const result = await usersService.logoutUser(token);

    if (result.error) {
      set.status = 401; // Unauthorized jika token tidak valid
    }

    return result;
  }, {
    detail: {
      summary: "Logout User",
      tags: ["Auth"],
      description: "Menghapus token sesi dari database untuk keluar dari sistem."
    }
  });
