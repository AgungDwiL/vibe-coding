# Fitur Logout User

Dokumen ini berisi panduan dan spesifikasi untuk mengimplementasikan fitur logout user. Panduan ini dirancang agar dapat diikuti selangkah demi selangkah oleh Junior Programmer atau asisten AI.

## 1. Implementasi API Logout User

Buat sebuah API endpoint untuk melakukan proses logout dengan menghapus token sesi.

### Spesifikasi Endpoint

- **Method**: `DELETE`
- **Path**: `/api/users/logout`

*(Anda harus menambahkannya di file `src/routes/users-route.ts` dan logika bisnisnya di `src/services/users-service.ts`)*.

### Request Header

API ini memerlukan header `Authorization` yang berisi token sesi (yang ada dari tabel `session`).

```http
Authorization: Bearer <token>
```

### Validasi & Logika Bisnis (dikerjakan di `users-service.ts`)

1. **Ambil Token**: Ekstrak nilai `<token>` dari header `Authorization: Bearer <token>`. Jika token tidak ada, kembalikan response error Unauthorized.
2. **Cek dan Hapus Sesi**: Lakukan query ke tabel `session` berdasarkan token yang diberikan. Jika sesi ditemukan, hapus data sesi tersebut dari tabel.
3. **Verifikasi**: Jika sesi tidak ditemukan atau token tidak valid, kembalikan response error Unauthorized.
4. **Kembalikan Status**: Jika penghapusan berhasil, kembalikan status sukses.

### Response Body

**Jika Berhasil (Success):**
Kembalikan format JSON:

```json
{
    "data": "oke"
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

- Endpoint `DELETE /api/users/logout` dapat diakses dan membaca header `Authorization`.
- Request dengan token yang valid akan menghapus data sesi di database dan mengembalikan pesan `"data": "oke"`.
- Request tanpa token, format Bearer salah, atau token tidak valid (tidak ada di database) akan mengembalikan error `{"error": "Unauthorized"}` dengan status 401.

## 3. Tahapan Implementasi

Berikut adalah langkah-langkah yang harus Anda lakukan:
1. Buka file `src/services/users-service.ts`. Tambahkan sebuah function baru (misal: `logoutUser(token: string)`) yang berisi logika untuk mencari token di tabel `session`, menghapus sesi tersebut jika ditemukan dan me-return `"oke"`, atau me-return pesan error "Unauthorized" jika tidak valid/tidak ada.
2. Buka file `src/routes/users-route.ts`. Tambahkan route handler baru untuk method DELETE di path `/users/logout` (sehingga utuhnya menjadi `/api/users/logout`).
3. Di dalam route handler tersebut, tangkap nilai dari header `authorization`, pisahkan dari kata "Bearer ", lalu panggil function `logoutUser` di service.
4. Pastikan status HTTP di-set ke 401 jika response dari service berupa error Unauthorized.
5. Gunakan file program test yang sudah disiapkan di folder `tests` (jika ada) untuk memverifikasi fungsionalitas ini.
