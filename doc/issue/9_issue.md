# Implementasi Fitur Swagger UI untuk Dokumentasi API

Dokumen ini berisi tahapan implementasi fitur Swagger UI agar API yang tersedia pada aplikasi ini dapat diakses dan diuji dengan mudah melalui antarmuka web. Instruksi ini dirancang secara detail untuk dieksekusi oleh Junior Programmer.

## 1. Instalasi Dependensi

ElysiaJS memiliki plugin resmi untuk Swagger. Langkah pertama adalah menginstal plugin tersebut.

**Langkah-langkah:**
1. Buka terminal di direktori *root* proyek.
2. Jalankan perintah berikut untuk menginstal dependensi plugin Swagger:
   ```bash
   bun add @elysiajs/swagger
   ```

## 2. Integrasi Swagger ke Aplikasi Utama

Setelah diinstal, plugin Swagger harus dipasang (di-*use*) pada *instance* utama Elysia di file `src/index.ts`.

**Langkah-langkah:**
1. Buka file `src/index.ts`.
2. Lakukan import plugin swagger di bagian atas file:
   ```typescript
   import { swagger } from "@elysiajs/swagger";
   ```
3. Tambahkan `.use(swagger())` pada *instance* Elysia. Sebaiknya diletakkan sebelum atau di awal pemanggilan `.use()` lainnya.
   Ubah kodenya menjadi seperti berikut:
   ```typescript
   const app = new Elysia()
     .use(swagger({
       documentation: {
         info: {
           title: 'Vibe Coding API',
           version: '1.0.0',
           description: 'Dokumentasi API untuk aplikasi Vibe Coding'
         }
       }
     }))
     .use(usersRoute)
     // ... endpoint lainnya
     .listen(3000);
   ```

## 3. Menambahkan Detail (Metadata) pada Setiap Endpoint

Agar Swagger UI terlihat rapi, terstruktur, dan profesional, tambahkan metadata (`detail`) pada skema validasi di file routing.

**Langkah-langkah:**
1. Buka file `src/routes/users-route.ts`.
2. Pada setiap endpoint (`.post`, `.get`, `.delete`), tambahkan properti `detail` di dalam argumen konfigurasi (satu blok dengan properti `body` validasi).
3. **Contoh untuk endpoint POST /users (Registrasi):**
   ```typescript
   .post("/users", async ({ body, set }) => {
     // ... logika handler tetap sama ...
   }, {
     detail: {
       summary: "Registrasi User Baru",
       tags: ["Users"],
       description: "Mendaftarkan akun pengguna baru ke sistem."
     },
     body: t.Object({
       // ... skema body tetap sama ...
     })
   })
   ```
4. Terapkan properti `detail` serupa untuk endpoint lainnya:
   - **POST /login**: Beri `summary: "Login User"` dan `tags: ["Auth"]`.
   - **GET /users/current**: Beri `summary: "Get Current User"` dan `tags: ["Users"]`.
   - **DELETE /users/logout**: Beri `summary: "Logout User"` dan `tags: ["Auth"]`.

## 4. Kriteria Penerimaan (Acceptance Criteria)

- Saat aplikasi dijalankan (`bun run src/index.ts`), mengakses URL `http://localhost:3000/swagger` di browser akan menampilkan halaman interaktif Swagger UI.
- Swagger UI menampilkan judul proyek "Vibe Coding API".
- Seluruh endpoint API terdaftar dan dikelompokkan berdasarkan *tags* ("Users" dan "Auth").
- Skema *request body* dapat dilihat dengan jelas dan fungsi "Try it out" berjalan normal untuk simulasi request.
