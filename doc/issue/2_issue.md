# Fitur Registrasi User Baru

Dokumen ini berisi panduan dan spesifikasi untuk mengimplementasikan fitur registrasi user baru. Panduan ini dirancang agar dapat diikuti selangkah demi selangkah oleh Junior Programmer atau asisten AI.

## 1. Persiapan Database (Skema Tabel)

Tugas pertama adalah memperbarui skema database dengan menambahkan tabel `users`.

**Spesifikasi Tabel `users`:**
- `id`: integer, auto increment, primary key
- `name`: varchar(255), tidak boleh kosong (not null)
- `email`: varchar(255), tidak boleh kosong (not null), harus unik (unique)
- `password`: varchar(255), tidak boleh kosong (not null). **Penting:** Kolom ini akan menyimpan password yang sudah di-hash menggunakan algoritma `bcrypt` (atau algoritma hash bawaan Bun yang direkomendasikan), bukan plain-text.
- `created_at`: timestamp, default nilai saat ini (current_timestamp)

**Langkah Implementasi:**
1. Buka file skema database (contoh: `src/db/schema.ts` jika menggunakan Drizzle ORM).
2. Definisikan tabel `users` sesuai dengan spesifikasi di atas.
3. Pastikan untuk membuat relasi atau file migrasi yang dibutuhkan, kemudian perbarui database (contoh: `bun run db:push`).

## 2. Struktur Folder & File

Untuk menjaga agar kode tetap terorganisir dengan baik, pisahkan antara logika routing (ElysiaJS) dan logika bisnis (Business Logic).

Buat struktur folder berikut di dalam direktori `src`:
```text
src/
├── routes/
│   └── users-route.ts
├── services/
│   └── users-service.ts
└── index.ts
```

- **`routes/users-route.ts`**: File ini hanya berisi definisi endpoint (HTTP method, path `/api/users`) dan validasi input (Elysia schema untuk request body). Route ini bertugas menerima request dan memanggil fungsi dari layer service, lalu mengembalikan response.
- **`services/users-service.ts`**: File ini berisi seluruh logika bisnis inti. Di sini proses query ke database (via Drizzle ORM), pengecekan ketersediaan email, dan proses hashing password dilakukan.

## 3. Implementasi API Registrasi

Buat sebuah API endpoint untuk melayani pendaftaran user baru.

### Spesifikasi Endpoint

- **Method**: `POST`
- **Path**: `/api/users`

### Request Body

Aplikasi mengekspektasikan HTTP request dengan body berformat JSON:

```json
{
    "name": "Agung",
    "email": "agung@email.com",
    "password": "password"
}
```

### Validasi & Logika Bisnis (dikerjakan di `users-service.ts`)

1. **Cek Ketersediaan Email**: Lakukan query ke tabel `users` untuk memeriksa apakah `email` yang diinputkan sudah terdaftar.
2. **Penanganan Email Duplikat**: Jika email sudah ada di database, segera hentikan proses dan kembalikan respon *error* (lihat format respon error di bawah).
3. **Hash Password**: Jika email belum terdaftar, lakukan proses enkripsi satu arah (*hashing*) pada input `password`. Gunakan `bcrypt` atau modul hashing bawaan Bun (`Bun.password.hash`).
4. **Simpan Data**: Simpan data `name`, `email`, dan password yang **sudah di-hash** ke dalam tabel `users`.

### Response Body

**Jika Berhasil Disimpan (Success):**
Kembalikan status HTTP `200` atau `201` dengan format JSON berikut:

```json
{
    "data": "OK"
}
```

**Jika Gagal (Error - misal: Email sudah terdaftar):**
Kembalikan status HTTP `400` Bad Request dengan format JSON berikut:

```json
{
    "error": "email sudah terdaftar"
}
```
*(Catatan: Anda dapat menggunakan format key `error` ini untuk jenis kesalahan validasi lainnya jika diperlukan).*

## 4. Integrasi ke Aplikasi Utama

Setelah file `users-route.ts` selesai dibuat, pastikan *route plugin* tersebut didaftarkan pada instance utama Elysia yang ada di `src/index.ts`.

Contoh implementasi:
```typescript
// di dalam src/index.ts
import { Elysia } from 'elysia';
import { usersRoute } from './routes/users-route';

const app = new Elysia()
    .use(usersRoute)
    // ... rute lainnya
    .listen(3000);
```

## 5. Kriteria Penerimaan (Acceptance Criteria)

- Tabel `users` beserta tipe datanya telah berhasil terbuat di database MySQL.
- Folder `routes` dan `services` berhasil dibuat dan berisi pemisahan logika yang benar.
- Endpoint `POST /api/users` dapat diakses dan menerima payload JSON dengan tepat.
- Input `password` tidak disimpan dalam bentuk teks biasa (plain-text) melainkan menggunakan hash.
- Registrasi dengan email baru berhasil dan mengembalikan `{ "data": "OK" }`.
- Registrasi dengan email yang sudah ada gagal dan mengembalikan `{ "error": "email sudah terdaftar" }`.
