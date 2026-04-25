# Bug: Error 500 saat Registrasi dengan Nama Lebih dari 255 Karakter

Dokumen ini berisi dokumentasi bug terkait validasi input registrasi dan panduan penyelesaiannya. Panduan ini dirancang agar dapat diikuti selangkah demi selangkah oleh Junior Programmer atau asisten AI.

## 1. Deskripsi Bug

Saat pengguna mencoba mendaftar (registrasi) melalui endpoint `POST /api/users` dengan memberikan nilai pada *field* `name` yang memiliki panjang lebih dari 255 karakter, server mengembalikan status HTTP `500 Internal Server Error` alih-alih `400 Bad Request`.

### Penyebab (Root Cause)
Di database (lihat `src/db/schema.ts`), kolom `name` pada tabel `users` dibatasi maksimal 255 karakter (`varchar(255)`). Namun, di level *route* aplikasi ElysiaJS (lihat `src/routes/users-route.ts`), validasi tipe pada *body request* hanya mengecek apakah inputnya adalah string (`t.String()`) tanpa mendefinisikan batasan maksimal (`maxLength`).

Karena tidak ada validasi level aplikasi, data terlalu panjang tersebut akan lolos validasi Elysia dan diteruskan langsung ke database. Database MySQL akan menolaknya dan memicu query error yang tertangkap sebagai error internal server (500).

## 2. Rencana Penyelesaian

Kita perlu menambahkan validasi batas panjang karakter (`maxLength`) untuk *field* `name` (serta sebaiknya untuk `email` dan `password` agar lebih aman) secara langsung di layer validasi ElysiaJS. Dengan demikian, jika data melebihi batas, Elysia akan merespons dengan HTTP `400 Bad Request` secara otomatis tanpa perlu melakukan *query* ke database.

### Lokasi Perubahan

- **File**: `src/routes/users-route.ts`

### Langkah-langkah Implementasi

1. Buka file `src/routes/users-route.ts`.
2. Cari definisi route `POST /users` (bagian registrasi).
3. Pada blok parameter validasi (`body: t.Object(...)`), ubah validasi *field* `name`.
4. Tambahkan konfigurasi `maxLength: 255` pada `t.String()`.
   Contoh sebelumnya: `name: t.String()`
   Ubah menjadi: `name: t.String({ maxLength: 255 })`
5. Lakukan hal yang sama untuk validasi `email` pada route `POST /users` dan `POST /login` (tambahkan `maxLength: 255` di parameter object yang berisi `format: 'email'`).
6. Lakukan penambahan `maxLength: 255` pada field `password` di route registrasi maupun login.

## 3. Kriteria Penerimaan (Acceptance Criteria)

- Jika dilakukan request `POST /api/users` dengan *field* `name` lebih dari 255 karakter, server akan membalas dengan status HTTP `400 Bad Request` (Bukan 500).
- Jika data valid (kurang dari 255 karakter), registrasi berhasil seperti biasa.
- Sistem tidak lagi mengeksekusi *query* ke database jika karakter melebihi batas, menghindari error query Drizzle/MySQL.

## 4. Tahapan Verifikasi

Berikut adalah langkah-langkah verifikasi yang harus dilakukan setelah perbaikan:
1. Pastikan server aplikasi berjalan.
2. Buat JSON payload dengan *field* `name` berisi 300 huruf 'A'.
3. Kirim request POST ke endpoint registrasi.
4. Verifikasi bahwa respons yang diterima memiliki status code `400 Bad Request`.
5. Kirim data yang valid untuk memastikan fungsi dasar registrasi masih beroperasi normal.
