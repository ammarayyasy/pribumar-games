# Progres Proyek - Pribumar Games

Terakhir diperbarui: 11 November 2026
Posisi saat ini: **Step 4 - Deploy ke Vercel & Maintenance**

## Checklist
- [x] Inisiasi (data usaha & desain terkumpul)
- [x] STEP 1 - Landing page & Katalog Game
  - [x] Hero (Headline, CTA, Trust Badges, Live Counter)
  - [x] Section Game Favorit (Katalog Populer dengan filter kategori & pencarian)
  - [x] Menu Pilihan Top Up / Denominasi (`/topup/[gameId]`)
  - [x] About, Services, News, Contact + Maps Embed
  - [x] Responsif & Aksesibilitas diuji
  - [x] Dikonfirmasi pengguna
- [x] STEP 2 - User management, dashboard, dan Google Spreadsheet
  - [x] Apps Script (`code.gs`, `setup.gs`) + fungsi inisiasi tabel `initTables()` idempoten
  - [x] Halaman Login & Register (`/login`) dengan validasi & feedback
  - [x] Role admin & user, hashing password bcrypt, sesi JWT httpOnly
  - [x] Proteksi rute `/dashboard` via middleware dan server role check
  - [x] Dashboard Admin: Manajemen User, Manajemen Role, CRUD Berita live
  - [x] Sinkronisasi real-time data Google Spreadsheet ke Dashboard (endpoint `/api/auth/me`, `/api/admin/users`, `/api/admin/news`)
  - [x] Modul Media Lokal (`src/lib/storage.ts`) ke `public/uploads/`
  - [x] Fitur Ganti Password Admin
  - [x] Dikonfirmasi pengguna
- [x] STEP 3 - Pemesanan / Top Up Game dengan QRIS
  - [x] Tabel `Orders` di Google Apps Script (`setup.gs`, `code.gs`) & `src/lib/db.ts`
  - [x] Alur Pemesanan Top Up dari halaman `/topup/[gameId]`
  - [x] Halaman Pembayaran QRIS & Ringkasan Tiket Pesanan (`/payment/[orderId]`)
  - [x] Halaman "Pesanan Anda" (`/orders`) untuk pengguna login
  - [x] Dashboard Admin: Tab Manajemen Tiket Pesanan & Konfirmasi Pembayaran
  - [x] Tombol pintas "Hubungi via WhatsApp" (`wa.me`)
  - [x] Dikonfirmasi pengguna
- [ ] STEP 4 - Deploy & maintenance
  - [ ] Konfirmasi kebutuhan lanjutan (otomasi payment gateway, notifikasi email/WA, media cloud)
  - [ ] Panduan Deploy langkah demi langkah ke Vercel
  - [ ] Pengecekan Environment Variables di Vercel
  - [ ] Checklist QA sebelum rilis
  - [ ] File pemeliharaan `MAINTENANCE.md`
  - [ ] Dikonfirmasi pengguna

## Catatan & Keputusan
- **Arsitektur Database:** Server Next.js berkomunikasi dengan Google Apps Script Web App yang mengelola Google Spreadsheet via Secret Token (`APPS_SCRIPT_SECRET`). Tersedia persistent local storage saat Apps Script belum disetel agar pengujian lokal instan tanpa hambatan.
- **Akun Admin Awal:** `admin@gmail.com` / `123456` (Password disimpan dalam format hash bcrypt `$2b$10$...`). Tersedia formulir ganti password di Dashboard.
- **Media Lokal:** File diupload ke `public/uploads/`. Sesuai aturan skill, ini bekerja optimal di development lokal; opsi migrasi ke cloud storage akan ditawarkan pada Step 4.
- **QRIS & Sistem Pemesanan:** Menggunakan gambar barcode QRIS resmi GoPay Merchant atas nama **MOHAMMAD AMMAR AYYASY, DIGITAL & KREATIF** (NMID: `ID1026545853032`) yang disimpan pada `public/images/qris-pribumar.jpg`.
- **Proteksi Akses Tiket:** Setiap tiket pesanan diisolasi di sisi server; pengguna biasa hanya bisa mengakses tiket miliknya sendiri, sedangkan admin dapat melihat dan memverifikasi semua pesanan.
- **Pengujian:** Seluruh QA test lolos 100%: login user, pembuatan tiket top up, pengambilan daftar pesanan user, verifikasi detail QRIS, deteksi pesanan masuk di dashboard admin, konfirmasi pembayaran oleh admin, pembaruan status real-time, dan pencegahan akses tidak sah antar pengguna.

## Cara Menjalankan & Menguji
1. Buka `http://localhost:3000/login` dan masuk dengan akun admin (`admin@gmail.com`) atau daftar akun baru (fitur "Isi Otomatis" telah dihapus untuk keamanan production).
2. Buka katalog game di Beranda atau langsung ke `http://localhost:3000/topup/mobile-legends`.
3. Masukkan ID Game, pilih nominal (cth: 86 Diamonds), masukkan nomor WhatsApp, lalu klik **"Beli Sekarang"**.
4. Sistem membuka halaman pembayaran `http://localhost:3000/payment/[orderId]` dengan gambar barcode QRIS resmi dan instruksi bayar.
5. Cek halaman **"Pesanan Anda"** di `http://localhost:3000/orders` (atau dari Navbar) untuk melihat status tiket.
6. Masuk ke Dashboard Admin di `http://localhost:3000/dashboard` pada tab **"Manajemen Pesanan"** untuk mengonfirmasi atau membatalkan pesanan serta menghubungi pelanggan via WhatsApp.
