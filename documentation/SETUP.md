# Panduan Menjalankan Proyek - Pribumar Games

Dokumen ini berisi panduan teknis untuk menjalankan website **Pribumar Games**, setup Google Apps Script & Google Spreadsheet, serta pengoperasian dashboard admin.

---

## 1. Prasyarat Sistem
- **Node.js** versi 18 ke atas (disarankan LTS v20.x)
- **NPM** atau **Yarn** / **PNPM**

---

## 2. Cara Menjalankan di Lokal (Development)

1. Buka terminal di folder proyek ini (`pribumar-games`).
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan server lokal:
   ```bash
   npm run dev
   ```
4. Buka browser dan akses:
   - Beranda Utama: [http://localhost:3000](http://localhost:3000)
   - Halaman Login: [http://localhost:3000/login](http://localhost:3000/login)
   - Dashboard Admin: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## 3. Akun Admin Awal & Keamanan

Saat pertama kali dijalankan, sistem secara otomatis menyediakan akun administrator awal:
- **Email:** `admin@gmail.com`
- **Password:** `123456`

> [!WARNING]
> **Peringatan Keamanan:** Password `123456` sangat lemah dan bersifat publik. Segera ganti password Anda melalui menu **"Ganti Password Admin"** di Dashboard sebelum website dipublikasikan ke production/Vercel.

---

## 4. Panduan Menghubungkan Google Spreadsheet (Google Apps Script)

Untuk menghubungkan website ini ke Google Spreadsheet sebagai database utama:

### Langkah A: Buat Google Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) dan buat spreadsheet baru dengan nama **"Database Pribumar Games"**.
2. Di menu atas, klik **Extensions > Apps Script** (Ekstensi > Apps Script).

### Langkah B: Masukkan Kode Apps Script
1. Di editor Apps Script, buat 2 file script (`.gs`):
   - Salin seluruh isi file [`code.gs`](file:///c:/Users/USER/OneDrive/Documents/file-belajar-semester-1/pribumar-games/code.gs) ke file `Code.gs`.
   - Tambahkan file script baru bernama `setup.gs`, lalu salin seluruh isi file [`setup.gs`](file:///c:/Users/USER/OneDrive/Documents/file-belajar-semester-1/pribumar-games/setup.gs).
2. Di menu dropdown fungsi di Apps Script, pilih fungsi **`initTables`** lalu klik **Run (Jalankan)**. Berikan izin akses (*Review Permissions*).
3. Spreadsheet Anda otomatis terisi sheet `Roles`, `Users`, `News`, dan `Orders` dengan data awal! Fungsi ini aman dijalankan berulang kali (idempoten). Jika sheet `Orders` belum ada, jalankan ulang fungsi `initTables` sekali lagi di Apps Script untuk membuatnya secara otomatis.

### Langkah C: Atur Secret Token (Script Properties)
1. Di menu samping Apps Script, klik ikon gerigi **Project Settings** (Setelan Project).
2. Gulir ke bawah ke bagian **Script Properties** (Properti Skrip).
3. Klik **Add script property**:
   - **Property:** `APPS_SCRIPT_SECRET`
   - **Value:** Buat kata sandi rahasia panjang Anda sendiri (contoh: `kunci_rahasia_pribumar_2026`)
4. Klik **Save script properties**.

### Langkah D: Deploy sebagai Web App
1. Di kanan atas editor Apps Script, klik tombol biru **Deploy > New deployment** (Terapkan > Penerapan baru).
2. Klik ikon gerigi jenis deployment, pilih **Web app**.
   - **Description:** Pribumar Games API v1
   - **Execute as:** `Me` (Akun Google Anda)
   - **Who has access:** `Anyone` (Siapa saja)
3. Klik **Deploy**, lalu salin **Web App URL** yang dihasilkan (formatnya: `https://script.google.com/macros/s/.../exec`).

### Langkah E: Simpan ke `.env.local` di Website
Buat file `.env.local` di root folder proyek ini (jangan khawatir, file ini sudah otomatis masuk `.gitignore`):
```env
APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID_ANDA/exec
APPS_SCRIPT_SECRET=kunci_rahasia_pribumar_2026
JWT_SECRET=rahasia_jwt_acak_minimal_32_karakter_bebas
```

---

## 5. Catatan Penting Penyimpanan Media Lokal di Vercel

Sesuai arsitektur Step 2:
- Semua file thumbnail yang diupload admin melalui dashboard disimpan sebagai file lokal di folder `public/uploads/`.
- **Perhatian untuk Production (Vercel):** Di server Vercel, harddisk bersifat *serverless & read-only/ephemeral*. File yang diupload saat aplikasi berjalan di Vercel tidak bertahan permanen.
- Ini bekerja 100% sempurna di laptop/komputer Anda (development).
- Pada **Step 4**, kita akan menawarkan opsi integrasi penyimpanan cloud (seperti Cloudinary, Vercel Blob, atau Google Drive) melalui modul terpusat [`src/lib/storage.ts`](file:///c:/Users/USER/OneDrive/Documents/file-belajar-semester-1/pribumar-games/src/lib/storage.ts) tanpa perlu merombak ulang tampilan dashboard Anda.
