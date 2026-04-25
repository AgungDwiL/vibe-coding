# Fitur Cek User yang Sedang Login (Current User)

Dokumen ini berisi panduan dan spesifikasi untuk mengimplementasikan fitur pengecekan user yang sedang login berdasarkan token sesi. Panduan ini dirancang agar dapat diikuti selangkah demi selangkah oleh Junior Programmer atau asisten AI.

## 1. Implementasi API Cek Current User

Buat sebuah API endpoint untuk mengambil data user yang sedang login menggunakan token otorisasi.

### Spesifikasi Endpoint

- **Method**: `GET`
- **Path**: `/api/users/current`

*(Anda harus menambahkannya di file `src/routes/users-route.ts` dan logika bisnisnya di `src/services/users-service.ts`)*.

### Request Header

API ini memerlukan header `Authorization` yang berisi token sesi (yang sebelumnya didapat dari hasil login dan tersimpan di tabel `session`).

```http
Authorization: Bearer <token>
```

### Validasi & Logika Bisnis (dikerjakan di `users-service.ts`)

1. **Ambil Token**: Ekstrak nilai `<token>` dari header `Authorization: Bearer <token>`. Jika token tidak ada, kembalikan response error Unauthorized.
2. **Cek Sesi**: Lakukan query ke tabel `session` berdasarkan token yang diberikan.
3. **Ambil Data User**: Jika sesi ditemukan, ambil data user yang terkait dengan `user_id` dari sesi tersebut.
4. **Verifikasi**: Jika sesi tidak ditemukan atau user tidak ada, kembalikan response error Unauthorized.
5. **Kembalikan Data User**: Jika valid, kembalikan object user. **PENTING: Jangan menyertakan password di dalam object user yang dikembalikan.**

### Response Body

**Jika Berhasil (Success):**
Kembalikan status HTTP `200` dengan format JSON yang berisi data user:

```json
{
    "data": {
        "id": 1,
        "name": "Nama User",
        "email": "user@email.com",
        "created_at": "2023-10-25T10:00:00Z"
    }
}
```

**Jika Gagal (Error - misal: Token tidak valid/tidak ada):**
Kembalikan status HTTP `401` dengan format JSON berikut:

```json
{
    "error": "Unauthorized"
}
```

## 2. Kriteria Penerimaan (Acceptance Criteria)

- Endpoint `GET /api/users/current` dapat diakses dan membaca header `Authorization`.
- Request dengan token yang valid akan mengembalikan object data user (tanpa menyertakan password).
- Request tanpa token, format Bearer salah, atau token tidak valid (tidak ada di database) akan mengembalikan error `{"error": "Unauthorized"}` dengan status 401.

## 3. Tahapan Implementasi

Berikut adalah langkah-langkah yang harus Anda lakukan:
1. Buka file `src/services/users-service.ts`. Tambahkan sebuah function baru (misal: `getCurrentUser(token: string)`) yang berisi logika untuk mencari token di tabel `session`, mengambil data user (tanpa password), lalu me-return data tersebut, atau me-return pesan error "Unauthorized" jika tidak valid.
2. Buka file `src/routes/users-route.ts`. Tambahkan route handler baru untuk method GET di path `/users/current` (sehingga utuhnya menjadi `/api/users/current`).
3. Di dalam route handler tersebut, tangkap nilai dari header `authorization`, pisahkan dari kata "Bearer ", lalu panggil function `getCurrentUser` di service.
4. Pastikan status HTTP di-set ke 401 jika response dari service berupa error Unauthorized.
5. Gunakan file program test yang sudah disiapkan di folder `tests` untuk memverifikasi fungsionalitas Endpoint registrasi, login, dan cek current user beroperasi dengan normal.
