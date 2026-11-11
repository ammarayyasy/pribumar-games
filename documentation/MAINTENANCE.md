# Maintenance Log - Pribumar Games

Dokumen ini mencatat rencana fitur lanjutan, log bug, serta riwayat perubahan pada sistem website **Pribumar Games**.

---

## 1. Backlog Fitur (Pengembangan Lanjutan)
- [ ] **Payment Gateway Otomatis:** Integrasi Midtrans / Xendit untuk verifikasi pembayaran QRIS dan Virtual Account tanpa perlu konfirmasi manual admin.
- [ ] **Notifikasi Transaksional Otomatis:** Kirim notifikasi status tiket via WhatsApp Gateway (Fonnte / WhatsApp Cloud API) atau Email (Resend).
- [ ] **Penyimpanan Media Cloud:** Migrasi folder `public/uploads/` ke cloud storage (seperti Cloudinary atau Vercel Blob) agar thumbnail berita baru tetap persisten saat deploy di Vercel.

---

## 2. Bug Diketahui (Known Issues)
*Saat ini tidak ada bug yang dilaporkan. Seluruh alur Step 1 hingga Step 3 telah diuji otomatis dan berfungsi 100%.*

---

## 3. Riwayat Perubahan (Changelog)

### [11 November 2026] - Step 3: Sistem Pemesanan & Pembayaran QRIS
- **Fitur Baru:** Menambahkan tabel `Orders` pada database Google Apps Script dan local storage.
- **Fitur Baru:** Menghubungkan formulir top up di `/topup/[gameId]` agar menerbitkan tiket pesanan unik (`PG-XXXXXX-YYY`).
- **Fitur Baru:** Menambahkan halaman pembayaran QRIS di `/payment/[orderId]` dengan barcode resmi GoPay Merchant atas nama **MOHAMMAD AMMAR AYYASY, DIGITAL & KREATIF** (NMID: `ID1026545853032`) serta panduan transfer 6 langkah.
- **Fitur Baru:** Menambahkan halaman riwayat pesanan pelanggan di `/orders` ("Pesanan Anda") dengan indikator status dinamis (`menunggu_konfirmasi`, `dikonfirmasi`, `dibatalkan`).
- **Fitur Baru:** Menambahkan menu "Pesanan Anda" pada Navbar untuk akun pengguna yang sedang login.
- **Fitur Baru:** Menambahkan tab **"Manajemen Pesanan"** di Dashboard Admin dengan counter tiket baru, pencarian, filter status, tombol konfirmasi pembayaran, dan tombol chat WhatsApp pelanggan.
- **Keamanan:** Proteksi hak akses tiket pesanan (hanya pembuat tiket atau admin yang berhak mengakses tiket terkait).

### [10 November 2026] - Perbaikan Sinkronisasi Dashboard Admin
- **Bug Fix:** Menambahkan endpoint `/api/auth/me` untuk validasi profil sesi admin.
- **Penyempurnaan:** Memperkuat pencarian pengguna di `src/lib/auth.ts` berdasarkan ID dan Email, serta penanganan format status aktif.
- **Penyempurnaan:** Menambahkan format tanggal yang aman (`formatDate`) dan pemisahan try-catch di dashboard agar pemuatan data pengguna, peran, dan berita berjalan independen.

### [10 November 2026] - Step 2: User Management, Dashboard & Google Spreadsheet
- **Fitur Baru:** Integrasi basis data Google Spreadsheet via Google Apps Script (`code.gs`, `setup.gs`) dengan otentikasi Secret Token.
- **Fitur Baru:** Sistem autentikasi pengguna (Login & Register) dengan hash password bcrypt dan sesi cookie HTTP-only JWT (`jose`).
- **Fitur Baru:** Proteksi rute `/dashboard` via middleware server.
- **Fitur Baru:** Dashboard Admin dengan Manajemen Pengguna, Manajemen Peran (Roles), dan CRUD Berita & Promo langsung tampil di landing page.
- **Fitur Baru:** Modul penyimpanan media lokal ke `public/uploads/` dan fitur ganti password admin.

### [10 November 2026] - Step 1: Landing Page & Katalog Game
- **Fitur Baru:** Inisiasi Next.js 14 App Router + Tailwind CSS dengan design tokens tema Pribumar Games.
- **Fitur Baru:** Komponen Hero, About, Services, NewsSection, ContactSection dengan Google Maps embed resmi Jonggol Raya.
- **Fitur Baru:** Katalog Game Favorit (`GamesCatalog`) dan halaman denominasi / nominal top up (`/topup/[gameId]`) sesuai referensi Barongsay.id.

