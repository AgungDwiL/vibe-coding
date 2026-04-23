# Fitur Login User & Manajemen Sesi

Dokumen ini berisi panduan dan spesifikasi untuk mengimplementasikan fitur login user dan pembuatan sesi (session). Panduan ini dirancang agar dapat diikuti selangkah demi selangkah oleh Junior Programmer atau asisten AI.

## 1. Persiapan Database (Skema Tabel `session`)

Tugas pertama adalah memperbarui skema database dengan menambahkan tabel `session`.

**Spesifikasi Tabel `session`:**
- `id`: integer, auto increment, primary key
- `token`: varchar(255), tidak boleh kosong (not null). Kolom ini akan menyimpan nilai UUID sebagai token unik untuk user yang sedang login.
- `user_id`: integer, tidak boleh kosong (not null). Kolom ini merujuk pada `id` di tabel `users`.
- `created_at`: timestamp, default nilai saat ini (current_timestamp)

**Langkah Implementasi:**
1. Buka file skema database (`src/db/schema.ts`).
2. Definisikan tabel `session` beserta referensi foreign key ke tabel `users`.
3. Jalankan perintah migrasi atau sinkronisasi dengan database (`bun run db:push`).

## 2. Implementasi API Login

Buat sebuah API endpoint untuk melayani proses autentikasi (login) user.

### Spesifikasi Endpoint

- **Method**: `POST`
- **Path**: `/api/login`

*(Anda dapat menambahkannya di file `src/routes/users-route.ts` dan logika bisnisnya di `src/services/users-service.ts`)*.

### Request Body

Aplikasi mengekspektasikan HTTP request dengan body berformat JSON:

```json
{
    "email": "agung@email.com",
    "password": "password"
}
```

### Validasi & Logika Bisnis (dikerjakan di `users-service.ts`)

1. **Cek Ketersediaan User**: Lakukan query ke tabel `users` untuk mencari data berdasarkan `email` yang diinputkan.
2. **Verifikasi Password**: Jika user ditemukan, bandingkan (verify) password dari request dengan password yang sudah di-hash di database menggunakan `Bun.password.verify`.
3. **Handle Gagal Login**: Jika user tidak ditemukan ATAU password tidak cocok, kembalikan respon error. Pastikan pesan error identik yaitu "email atau password salah".
4. **Buat Sesi & Token**: Jika verifikasi berhasil:
    - Buat sebuah UUID baru (menggunakan `crypto.randomUUID()`).
    - Simpan UUID tersebut sebagai `token` dan ID dari user tersebut sebagai `user_id` ke dalam tabel `session`.
5. **Kembalikan Token**: Kembalikan UUID tersebut sebagai respon ke client.

### Response Body

**Jika Login Berhasil (Success):**
Kembalikan status HTTP `200` dengan format JSON berikut:

```json
{
    "data": "123e4567-e89b-12d3-a456-426614174000" // (Ini hanya contoh UUID)
}
```

**Jika Gagal (Error - misal: Kombinasi email/password salah):**
Kembalikan status HTTP `400` atau `401` dengan format JSON berikut:

```json
{
    "error": "email atau password salah"
}
```

## 3. Kriteria Penerimaan (Acceptance Criteria)

- Tabel `session` berhasil terbuat di database dengan kolom sesuai spesifikasi.
- Endpoint `POST /api/login` dapat menerima payload JSON email & password.
- Proses login dengan kredensial salah menghasilkan error `{"error": "email atau password salah"}` tanpa membocorkan info user tersedia atau tidak.
- Proses login yang sukses menghasilkan token UUID, menyimpan sesi ke tabel `session` (terhubung ke user_id), dan mengembalikan response `{"data": "<UUID>"}`.
