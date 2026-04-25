# Unit Testing untuk Semua API

Dokumen ini berisi perencanaan untuk mengimplementasikan unit test pada semua API yang tersedia dalam aplikasi. Pengujian dilakukan untuk memastikan fungsionalitas berjalan dengan benar dan mencegah terjadinya regresi.

## 1. Lingkungan Pengujian

- **Framework**: `bun test`
- **Folder**: `tests/`

## 2. Strategi Pengujian

Untuk menjaga konsistensi dan integritas data, setiap skenario pengujian harus:
1. Menghapus data terkait di database sebelum menjalankan pengujian (Clean state).
2. Melakukan request ke API.
3. Memverifikasi respons (status code, body, dll).

## 3. Skenario Pengujian

### User Registration (POST /api/users)
- **Skenario Sukses**: Registrasi user baru dengan data valid.
- **Skenario Gagal (Email Duplikat)**: Registrasi dengan email yang sudah terdaftar.
- **Skenario Gagal (Invalid Data)**: Registrasi dengan format email salah atau data tidak lengkap.
- **Skenario Gagal (Input Terlalu Panjang)**: Registrasi dengan field (nama/email/password) melebihi 255 karakter.

### User Login (POST /api/login)
- **Skenario Sukses**: Login dengan kredensial yang benar.
- **Skenario Gagal (Invalid Credentials)**: Login dengan email atau password yang salah.
- **Skenario Gagal (User Not Found)**: Login dengan email yang belum terdaftar.

### Get Current User (GET /api/users/current)
- **Skenario Sukses**: Mengambil data user yang sedang login menggunakan token valid.
- **Skenario Gagal (Invalid Token)**: Mengakses tanpa token atau menggunakan token yang tidak valid/sudah kadaluarsa.

### User Logout (DELETE /api/users/logout)
- **Skenario Sukses**: Menghapus sesi user menggunakan token valid.
- **Skenario Gagal (Invalid Token)**: Melakukan logout tanpa token atau dengan token tidak valid.

## 4. Kriteria Penerimaan (Acceptance Criteria)

- Semua unit test di folder `tests/` dapat dijalankan menggunakan perintah `bun test`.
- Semua skenario pengujian di atas ter-cover.
- Pengujian tidak meninggalkan data sampah di database (atau selalu dibersihkan di awal).
- Seluruh test suite memberikan hasil "Passed".
