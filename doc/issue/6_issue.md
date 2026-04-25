# Refactoring: Ekstraksi Token Autentikasi (DRY)

Dokumen ini berisi panduan untuk melakukan refactoring pada bagian ekstraksi token autentikasi di router untuk menghindari duplikasi kode. Panduan ini dirancang agar dapat diikuti selangkah demi selangkah oleh Junior Programmer atau asisten AI.

## 1. Latar Belakang

Saat ini, logika untuk mengambil token dari header `Authorization` (Bearer token) ditulis secara berulang di setiap route yang memerlukan autentikasi (misal: `/users/current` dan `/users/logout`). Hal ini melanggar prinsip DRY (Don't Repeat Yourself).

## 2. Rencana Refactoring

Kita akan menggunakan fitur `.derive()` pada ElysiaJS untuk mengekstrak token secara otomatis dan menyediakannya sebagai parameter dalam route handler.

### Lokasi Perubahan

- **File**: `src/routes/users-route.ts`

### Langkah-langkah Implementasi

1. **Gunakan `.derive()`**: Tambahkan method `.derive(({ headers, set }) => { ... })` pada instance `usersRoute`.
2. **Logika Ekstraksi**: Di dalam `.derive()`, ambil header `authorization`.
3. **Validasi**: Lakukan pengecekan apakah header ada dan berformat `Bearer <token>`.
4. **Error Handling**: Jika tidak valid, set status 401 dan kembalikan error "Unauthorized". Namun perlu diperhatikan bahwa `.derive()` tidak bisa langsung menghentikan request dengan return (hanya menambah state). Jika ingin menghentikan request, pertimbangkan menggunakan `.onBeforeHandle()` atau pastikan handler mengecek keberadaan token yang di-inject.
   *Catatan: Dalam Elysia, jika `.derive()` gagal me-return sesuatu yang valid, handler selanjutnya harus bisa menangani kondisi tersebut.*

## 3. Kriteria Penerimaan (Acceptance Criteria)

- Logika ekstraksi token hanya ditulis di satu tempat.
- Route `/users/current` dan `/users/logout` tetap berfungsi normal dengan kode yang lebih ringkas.
- Request tanpa token atau token tidak valid tetap mengembalikan error `{"error": "Unauthorized"}` dengan status 401.

## 4. Tahapan Implementasi

Berikut adalah langkah-langkah yang harus Anda lakukan:
1. Buka file `src/routes/users-route.ts`.
2. Pelajari cara penggunaan `.derive()` atau `.resolve()` di ElysiaJS untuk menangani autentikasi.
3. Pindahkan logika ekstraksi token dari handler-handler yang ada ke sebuah middleware atau helper yang bisa digunakan bersama.
4. Update parameter route handler agar menggunakan hasil ekstraksi tersebut.
5. Hapus kode ekstraksi token yang duplikat di dalam masing-masing route handler.
6. Jalankan aplikasi dan tes menggunakan `tests/api.http` untuk memastikan fitur `current user` dan `logout` masih bekerja dengan benar.
