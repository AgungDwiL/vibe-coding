# Panduan Inisialisasi Proyek: API dengan Bun, ElysiaJS, dan Drizzle ORM

Dokumen ini berisi langkah-langkah high-level untuk menginisialisasi proyek baru di direktori ini. Dokumen ini dirancang sebagai panduan bagi programmer atau asisten AI untuk melakukan implementasi.

## Teknologi yang Digunakan
- **Runtime & Package Manager**: Bun
- **Web Framework**: ElysiaJS
- **ORM**: Drizzle ORM
- **Database**: MySQL

## Langkah-langkah Implementasi

### 1. Inisialisasi Proyek
- Inisialisasi proyek Bun baru (atau gunakan *template* ElysiaJS yang tersedia).
- Pastikan proyek terinisialisasi di direktori root yang sudah ada ini.
- Sesuaikan informasi dasar proyek di dalam `package.json`.

### 2. Instalasi Dependensi
- Pasang framework utama: ElysiaJS.
- Pasang Drizzle ORM beserta driver MySQL yang direkomendasikan untuk Bun (misalnya `mysql2`).
- Pasang dependensi *development* yang dibutuhkan, seperti `drizzle-kit` untuk keperluan migrasi skema database.

### 3. Konfigurasi Database (Drizzle & MySQL)
- Siapkan pengaturan *environment variables* (file `.env`) untuk menyimpan URL koneksi database MySQL.
- Buat konfigurasi Drizzle (contoh: `drizzle.config.ts`) untuk mengatur target database dan lokasi file skema.
- Buat file skema database awal (contoh: `schema.ts`) yang berisi definisi tabel sederhana untuk keperluan testing.

### 4. Konfigurasi Server Elysia
- Buat file *entry point* aplikasi (contoh: `src/index.ts`).
- Setup instance server Elysia.
- Lakukan inisialisasi instance Drizzle ORM di dalam aplikasi sehingga dapat digunakan di dalam *handlers/routes*.
- Buat sebuah *route* dasar (misal: `GET /`) untuk memastikan server berjalan dengan baik.

### 5. Pengaturan Skrip Command
Tambahkan *scripts* dasar pada `package.json` untuk mempermudah alur kerja:
- Skrip untuk menjalankan *development server* (contoh: `bun run dev`).
- Skrip untuk memproses migrasi/push skema Drizzle ke database MySQL.

## Kriteria Penerimaan (Acceptance Criteria)
- Perintah untuk menjalankan server berhasil dieksekusi tanpa error.
- Aplikasi dapat merespons HTTP request pada route dasar.
- Proyek siap digunakan untuk pengembangan fitur lebih lanjut dengan database MySQL yang sudah terhubung melalui Drizzle ORM.
