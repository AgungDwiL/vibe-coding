# Vibe Coding Backend API

Ini adalah aplikasi backend API berbasis REST yang dikembangkan menggunakan **Bun** dan **ElysiaJS**. Aplikasi ini menyediakan fitur manajemen pengguna sederhana (autentikasi, registrasi, pengambilan data user, dan logout).

## Teknologi Stack
- **Runtime**: [Bun](https://bun.sh/) (v1.3+)
- **Framework**: [ElysiaJS](https://elysiajs.com/)
- **Database**: MySQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)

## Library yang Digunakan
- `elysia` - Web framework yang cepat dan ringan.
- `drizzle-orm` - TypeScript ORM untuk query database.
- `mysql2` - Driver database MySQL.
- `bun:test` - Runner untuk unit testing bawaan dari Bun.
- `drizzle-kit` (dev) - CLI tools untuk migrasi Drizzle.

## Struktur Folder dan Penamaan File
Proyek ini mengadopsi pemisahan *concern* antara logika *routing* dan logika bisnis (*services*).
- `src/` - Berisi seluruh *source code* utama aplikasi.
  - `db/` - Konfigurasi koneksi database (`index.ts`) dan definisi skema Drizzle (`schema.ts`).
  - `routes/` - Berisi definisi endpoint dan validasi input. Penamaan file menggunakan format `-route.ts` (contoh: `users-route.ts`).
  - `services/` - Berisi logika bisnis (interaksi ke database, hashing, dll). Penamaan file menggunakan format `-service.ts` (contoh: `users-service.ts`).
- `tests/` - Berisi skenario unit testing. Penamaan file menggunakan format `.test.ts` (contoh: `users.test.ts`).
- `doc/` - Berisi dokumentasi internal berupa log *prompt* asisten AI dan spesifikasi/perencanaan (*issue*).

## Skema Database
Aplikasi ini menggunakan 2 tabel utama:

1. **users**
   - `id` (INT, Primary Key, Auto Increment)
   - `name` (VARCHAR 255)
   - `email` (VARCHAR 255, Unique)
   - `password` (VARCHAR 255, Hashed)
   - `createdAt` (TIMESTAMP)

2. **sessions**
   - `id` (INT, Primary Key, Auto Increment)
   - `token` (VARCHAR 255)
   - `userId` (INT, Foreign Key ke tabel `users`)
   - `createdAt` (TIMESTAMP)

## API yang Tersedia

### 1. Registrasi User
- **Endpoint**: `POST /api/users`
- **Body**: `{ "name": "...", "email": "...", "password": "..." }`
- **Deskripsi**: Mendaftarkan akun baru.

### 2. Login User
- **Endpoint**: `POST /api/login`
- **Body**: `{ "email": "...", "password": "..." }`
- **Deskripsi**: Melakukan login dan mengembalikan `token` sesi.

### 3. Get Current User
- **Endpoint**: `GET /api/users/current`
- **Header**: `Authorization: Bearer <token>`
- **Deskripsi**: Mengambil data pengguna yang saat ini sedang login berdasarkan token.

### 4. Logout User
- **Endpoint**: `DELETE /api/users/logout`
- **Header**: `Authorization: Bearer <token>`
- **Deskripsi**: Menghapus token sesi dari database untuk melakukan logout.

## Cara Setup Project

1. Pastikan Anda sudah menginstal **Bun** dan server **MySQL** yang berjalan.
2. Clone repositori ini.
3. Instal semua dependensi:
   ```bash
   bun install
   ```
4. Buat file `.env` di root project dan sesuaikan konfigurasi database Anda:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/vibe_db"
   ```
5. Sinkronkan skema ke database MySQL Anda menggunakan Drizzle Kit:
   ```bash
   bunx drizzle-kit push
   ```

## Cara Menjalankan (Run) Aplikasi

Untuk menjalankan server secara lokal:

```bash
bun run src/index.ts
```
Server akan berjalan dan dapat diakses di `http://localhost:3000`.

## Cara Test Aplikasi

Pengujian aplikasi menggunakan runner `bun test`. Pengujian mencakup seluruh skenario (sukses dan gagal) secara otomatis dan mengeksekusi request ke instance Elysia.

```bash
bun test
```
**Peringatan**: Saat menjalankan `bun test`, skrip pengujian dirancang untuk menghapus (clean up) data pada tabel `users` dan `sessions` di setiap skenario agar mendapatkan *clean state*. Pastikan Anda tidak menjalankannya di database produksi.
