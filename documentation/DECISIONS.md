# Keputusan Arsitektur & Desain - Pribumar Games

Dokumen ini mencatat keputusan teknis penting yang diambil selama pengembangan.

---

## 1. Stack Teknologi: Next.js (App Router) + Tailwind CSS
- **Alasan:** Next.js App Router merupakan standar industri yang didukung secara native oleh Vercel (target deploy). Menghasilkan performa tinggi, Server Components yang cepat, dan dukungan SEO yang optimal.
- **Tailwind CSS:** Memungkinkan implementasi token desain secara presisi tanpa beban CSS berlebih.

---

## 2. Sistem Desain (Design Tokens)
Token desain diekstrak langsung dari spesifikasi desain di `design-reference/stitch_pribumar_game_landing_page/pribumar_game/DESIGN.md`:
- **Warna Dominan:**
  - Obsidian Base / Surface: `#14121b`, `#211e28`, `#0f0d16`
  - Primary Electric Violet: `#8e1ea2` / `#f9acff`
  - Action Mint-Cyan: `#98e8de`
  - Secondary Magenta / Soft Purple: `#e3b5ff`, `#643187`
- **Tipografi:**
  - `Plus Jakarta Sans`: untuk heading, judul display, nominal angka, dan badge status.
  - `Inter`: untuk teks body naratif, formulir, dan paragraf agar sangat terbaca di mobile dan desktop.

---

## 3. Arsitektur Database Google Spreadsheet (Step 2)
```
Browser -> Next.js (Server API Route) -> Apps Script Web App -> Google Spreadsheet
```
- **Alasan Lapisan Ini:** Browser **tidak pernah** memanggil Apps Script secara langsung, melainkan melalui server Next.js dengan secret token bersama (`APPS_SCRIPT_SECRET`). Ini mencegah siapapun mengintip URL atau memanipulasi spreadsheet dari console browser.
- **Persistent Local Fallback:** Untuk mempermudah proses evaluasi dan desain oleh desainer tanpa harus langsung deploy Google Apps Script, sistem dilengkapi fallback persistent local JSON database di server. Saat URL Apps Script diisi, aplikasi langsung beralih ke spreadsheet secara seamless.

---

## 4. Keamanan Autentikasi & Role Management (Step 2)
- **Hash Password:** Password di-hash menggunakan algoritma **Bcrypt** di server Next.js sebelum dikirim ke database. Spreadsheet hanya menyimpan string hash, bukan password asli.
- **Sesi:** Sesi login dikelola menggunakan token JWT bertanda tangan via library `jose`, disimpan dalam cookie `httpOnly`, `sameSite: lax`.
- **Proteksi Rute Admin:** Middleware Next.js di `src/middleware.ts` memeriksa token dan memastikan role bernilai `admin`. Pengguna biasa atau pengunjung anonim yang mengetik URL `/dashboard` otomatis diarahkan kembali.
- **Aturan Proteksi Diri:** Admin tidak dapat menghapus atau menonaktifkan akunnya sendiri dari tabel manajemen user untuk mencegah sistem terkunci tanpa administrator.

---

## 5. Media Upload & Catatan Vercel (Step 2 & 4)
- Upload media thumbnail ditangani melalui modul terpusat `src/lib/storage.ts` yang memvalidasi ukuran file (max 5MB) dan ekstensi gambar aman.
- File disimpan ke folder lokal `public/uploads/` dengan nama acak unik ber-timestamp.
- Karena sistem serverless Vercel tidak menyimpan penulisan file disk secara permanen, arsitektur `src/lib/storage.ts` dirancang modular agar mudah dihubungkan ke cloud storage (seperti Vercel Blob / Cloudinary) pada Step 4.
