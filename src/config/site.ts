export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "PROMO" | "KERJASAMA" | "EDUKASI";
  date: string;
  thumbnail: string;
  author: string;
}

export interface DenominationItem {
  id: string;
  name: string;
  amount: number | string;
  price: number;
  bonus?: string;
  discount?: string;
  isPopular?: boolean;
}

export interface GameItem {
  id: string;
  name: string;
  slug: string;
  publisher: string;
  category: "mobile" | "pc" | "voucher";
  image: string;
  badge: string;
  popular: boolean;
  requiresZoneId: boolean;
  zoneIdLabel?: string;
  currencyName: string;
  denominations: DenominationItem[];
}

export interface PaymentMethodItem {
  id: string;
  name: string;
  category: "qris" | "ewallet" | "va";
  fee: number;
  badge: string;
  desc: string;
}

export const siteConfig = {
  name: "Pribumar Games",
  tagline: "Platform Top Up Game Termurah & Terlengkap Se-Jagat Raya",
  description:
    "Platform top up game termurah dan terlengkap se jagat raya. Dibangun dan dikelola oleh owner sendiri sejak tahun 2026 dengan pelayanan terbaik, pengiriman instan 24/7, dan garansi 100% legal.",
  industry: "Top Up Game",
  foundedYear: 2026,
  ownerNote: "Pelayanan terbaik dari tangan owner sendiri secara personal dan profesional.",
  logo: "/images/logo.png",
  contact: {
    address: "SMK IDN Boarding School, Jonggol Raya, Bogor, Jawa Barat 16830",
    mapsUrl: "https://maps.app.goo.gl/v5c8gjtfSgA7xJKM8",
    mapsEmbedUrl:
      "https://maps.google.com/maps?q=-6.5252823,107.0381356&hl=id&z=15&output=embed",
    phone: "+62 812-9988-7711",
    whatsapp: "6281299887711",
    emailSupport: "support@pribumargames.id",
    emailPartnership: "partnership@pribumargames.id",
    operatingHours: "Transaksi: Otomatis 24 Jam | CS Live: 08.00 - 24.00 WIB",
  },
  qris: {
    image: "/images/qris-pribumar.jpg",
    merchantName: "MOHAMMAD AMMAR AYYASY, DIGITAL & KREATIF",
    nmid: "ID1026545853032",
    printerCode: "93600914",
    supportedApps: "GoPay, BCA, Mandiri, BNI, BRI, OVO, DANA, ShopeePay, LinkAja",
    instructions: [
      "Buka aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau E-Wallet (GoPay, OVO, DANA, ShopeePay) di ponsel Anda.",
      "Pilih menu 'Bayar' atau 'Scan QRIS'.",
      "Arahkan kamera ke gambar QR Code atau unggah screenshot barcode QRIS di bawah ini.",
      "Pastikan nama merchant yang muncul adalah 'MOHAMMAD AMMAR AYYASY, DIGITAL & KREATIF'.",
      "Ketikkan nominal pembayaran tepat sesuai total tagihan tiket pesanan Anda.",
      "Setelah pembayaran berhasil, simpan bukti transfer dan klik tombol 'Konfirmasi Pembayaran via WhatsApp'.",
    ],
  },
  stats: [
    { value: "< 10 Detik", label: "Proses Otomatis", icon: "Zap" },
    { value: "100% Legal", label: "Garansi Resmi", icon: "ShieldCheck" },
    { value: "50+ Game", label: "Katalog Populer", icon: "Gamepad2" },
    { value: "4.9/5 Rating", label: "Ribuan Gamers Puas", icon: "Star" },
  ],
  popularGames: [
    {
      id: "mobile-legends",
      name: "Mobile Legends: Bang Bang",
      slug: "mobile-legends",
      publisher: "Moonton",
      category: "mobile",
      image: "/images/games/mlbb.svg",
      badge: "TERPOPULER",
      popular: true,
      requiresZoneId: true,
      zoneIdLabel: "Zone ID (Contoh: 2045)",
      currencyName: "Diamonds",
      denominations: [
        { id: "ml-86", name: "86 Diamonds", amount: 86, price: 21000 },
        { id: "ml-172", name: "172 Diamonds", amount: 172, price: 42000, bonus: "+16 Bonus" },
        { id: "ml-257", name: "257 Diamonds", amount: 257, price: 63500 },
        { id: "ml-344", name: "344 Diamonds", amount: 344, price: 84000 },
        { id: "ml-706", name: "706 Diamonds", amount: 706, price: 171000, bonus: "+66 Bonus", isPopular: true },
        { id: "ml-1050", name: "1050 Diamonds", amount: 1050, price: 255000, bonus: "Best Deal" },
        { id: "ml-wdp", name: "Weekly Diamond Pass", amount: "Pass", price: 28500, discount: "Hemat 40%", isPopular: true },
        { id: "ml-twilight", name: "Twilight Pass", amount: "Pass", price: 145000 },
      ],
    },
    {
      id: "free-fire",
      name: "Free Fire MAX",
      slug: "free-fire",
      publisher: "Garena",
      category: "mobile",
      image: "/images/games/ff.svg",
      badge: "INSTAN",
      popular: true,
      requiresZoneId: false,
      currencyName: "Diamonds",
      denominations: [
        { id: "ff-70", name: "70 Diamonds", amount: 70, price: 9800 },
        { id: "ff-140", name: "140 Diamonds", amount: 140, price: 19500 },
        { id: "ff-355", name: "355 Diamonds", amount: 355, price: 48000, isPopular: true },
        { id: "ff-720", name: "720 Diamonds", amount: 720, price: 96000, bonus: "+50 Bonus" },
        { id: "ff-1440", name: "1440 Diamonds", amount: 1440, price: 192000 },
        { id: "ff-week", name: "Membership Mingguan", amount: "Pass", price: 28000 },
        { id: "ff-month", name: "Membership Bulanan", amount: "Pass", price: 115000, discount: "Hemat 60%" },
      ],
    },
    {
      id: "pubg-mobile",
      name: "PUBG Mobile",
      slug: "pubg-mobile",
      publisher: "Level Infinite",
      category: "mobile",
      image: "/images/games/pubg.svg",
      badge: "RESMI",
      popular: true,
      requiresZoneId: false,
      currencyName: "Unknown Cash (UC)",
      denominations: [
        { id: "pubg-60", name: "60 UC", amount: 60, price: 14500 },
        { id: "pubg-325", name: "325 UC", amount: 325, price: 73000 },
        { id: "pubg-660", name: "660 UC", amount: 660, price: 146000, isPopular: true, bonus: "Royale Pass" },
        { id: "pubg-1800", name: "1800 UC", amount: 1800, price: 365000 },
      ],
    },
    {
      id: "honor-of-kings",
      name: "Honor of Kings",
      slug: "honor-of-kings",
      publisher: "Level Infinite",
      category: "mobile",
      image: "/images/games/hok.svg",
      badge: "HOT",
      popular: true,
      requiresZoneId: false,
      currencyName: "Tokens",
      denominations: [
        { id: "hok-80", name: "80 Tokens", amount: 80, price: 15000 },
        { id: "hok-240", name: "240 Tokens", amount: 240, price: 45000 },
        { id: "hok-400", name: "400 Tokens", amount: 400, price: 75000, isPopular: true },
        { id: "hok-800", name: "800 Tokens", amount: 800, price: 149000 },
      ],
    },
    {
      id: "genshin-impact",
      name: "Genshin Impact",
      slug: "genshin-impact",
      publisher: "HoYoverse",
      category: "mobile",
      image: "/images/games/genshin.svg",
      badge: "GLOBAL",
      popular: true,
      requiresZoneId: true,
      zoneIdLabel: "Server (Asia / America / Europe)",
      currencyName: "Genesis Crystals",
      denominations: [
        { id: "gi-welkin", name: "Blessing of Welkin Moon", amount: "Pass", price: 79000, isPopular: true },
        { id: "gi-60", name: "60 Genesis Crystals", amount: 60, price: 16000 },
        { id: "gi-330", name: "300+30 Genesis Crystals", amount: 330, price: 79000 },
        { id: "gi-1090", name: "980+110 Genesis Crystals", amount: 1090, price: 245000 },
      ],
    },
    {
      id: "valorant",
      name: "Valorant Points (VP)",
      slug: "valorant",
      publisher: "Riot Games",
      category: "pc",
      image: "/images/games/valorant.svg",
      badge: "DIRECT RIOT ID",
      popular: true,
      requiresZoneId: false,
      currencyName: "Valorant Points",
      denominations: [
        { id: "val-475", name: "475 Points", amount: 475, price: 50000 },
        { id: "val-1000", name: "1000 Points", amount: 1000, price: 100000, isPopular: true },
        { id: "val-2050", name: "2050 Points", amount: 2050, price: 200000 },
        { id: "val-3650", name: "3650 Points", amount: 3650, price: 350000 },
      ],
    },
    {
      id: "roblox",
      name: "Roblox Robux",
      slug: "roblox",
      publisher: "Roblox Corp",
      category: "pc",
      image: "/images/games/roblox.svg",
      badge: "KODE VOUCHER",
      popular: false,
      requiresZoneId: false,
      currencyName: "Robux",
      denominations: [
        { id: "rbx-80", name: "80 Robux", amount: 80, price: 17000 },
        { id: "rbx-400", name: "400 Robux", amount: 400, price: 79000, isPopular: true },
        { id: "rbx-800", name: "800 Robux", amount: 800, price: 155000 },
      ],
    },
    {
      id: "steam-wallet",
      name: "Steam Wallet IDR",
      slug: "steam-wallet",
      publisher: "Valve Corporation",
      category: "voucher",
      image: "/images/games/steam.svg",
      badge: "KODE OTOMATIS",
      popular: false,
      requiresZoneId: false,
      currencyName: "IDR Wallet",
      denominations: [
        { id: "stm-45", name: "Rp 45.000 Wallet", amount: "Rp 45k", price: 49000 },
        { id: "stm-90", name: "Rp 90.000 Wallet", amount: "Rp 90k", price: 98000, isPopular: true },
        { id: "stm-120", name: "Rp 120.000 Wallet", amount: "Rp 120k", price: 130000 },
        { id: "stm-250", name: "Rp 250.000 Wallet", amount: "Rp 250k", price: 270000 },
      ],
    },
  ] as GameItem[],
  paymentMethodsList: [
    {
      id: "qris",
      name: "QRIS (Semua E-Wallet & M-Banking)",
      category: "qris",
      fee: 0,
      badge: "GRATIS BIAYA",
      desc: "Scan via BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay",
    },
    {
      id: "gopay",
      name: "GoPay",
      category: "ewallet",
      fee: 0,
      badge: "OTOMATIS",
      desc: "Konfirmasi instan lewat aplikasi GoJek",
    },
    {
      id: "dana",
      name: "DANA",
      category: "ewallet",
      fee: 0,
      badge: "OTOMATIS",
      desc: "Bayar mudah dengan saldo DANA Anda",
    },
    {
      id: "ovo",
      name: "OVO",
      category: "ewallet",
      fee: 0,
      badge: "OTOMATIS",
      desc: "Notifikasi push langsung ke ponsel",
    },
    {
      id: "shopeepay",
      name: "ShopeePay",
      category: "ewallet",
      fee: 0,
      badge: "OTOMATIS",
      desc: "Integrasi cepat akun Shopee",
    },
    {
      id: "bca-va",
      name: "BCA Virtual Account",
      category: "va",
      fee: 1000,
      badge: "24 JAM",
      desc: "Transfer via KlikBCA / m-BCA / ATM BCA",
    },
    {
      id: "mandiri-va",
      name: "Mandiri Virtual Account",
      category: "va",
      fee: 1000,
      badge: "24 JAM",
      desc: "Transfer via Livin by Mandiri / ATM",
    },
    {
      id: "bri-va",
      name: "BRI Virtual Account (BRIVA)",
      category: "va",
      fee: 1000,
      badge: "24 JAM",
      desc: "Transfer via BRImo / ATM BRI",
    },
  ] as PaymentMethodItem[],
  pillars: [
    {
      title: "Pengiriman Instan 24/7",
      description:
        "Sistem integrasi API langsung ke publisher game memastikan diamond, token, dan koin masuk dalam hitungan detik tanpa antrean manual kapan saja.",
      icon: "Rocket",
      colorClass: "bg-secondary-container text-on-secondary-container",
    },
    {
      title: "Harga Termurah & Transparan",
      description:
        "Termurah se-Jagat Raya tanpa biaya tersembunyi. Dapatkan diskon langsung, promo flash sale, dan cashback loyalitas setiap pengisian.",
      icon: "BadgePercent",
      colorClass: "bg-primary-container text-on-primary-container",
    },
    {
      title: "Pelayanan Personal dari Owner",
      description:
        "Dikelola langsung oleh owner sejak 2026, memastikan setiap kendala User ID, zona server, atau transaksi ditangani cepat dan bertanggung jawab.",
      icon: "Headset",
      colorClass: "bg-tertiary-container text-on-tertiary-container",
    },
  ],
  services: [
    {
      id: "mobile-games",
      title: "Mobile Games Direct Top Up",
      description:
        "Mobile Legends: Bang Bang, Free Fire MAX, PUBG Mobile, Honor of Kings, dan Genshin Impact. Cukup masukkan User ID & Server tanpa password.",
      badge: "Proses: 3 - 10 Detik",
      icon: "Smartphone",
    },
    {
      id: "pc-console",
      title: "PC & Console Gaming Currency",
      description:
        "Steam Wallet Code IDR, Valorant Points (Riot Cash Pin), PlayStation Network ID, EA Play, dan Robux legal resmi distributor.",
      badge: "Kode Serial Otomatis",
      icon: "Gamepad",
    },
    {
      id: "digital-vouchers",
      title: "Voucher Digital & Langganan",
      description:
        "Google Play Gift Card Indonesia, Discord Nitro, Apple Gift Card, Spotify Premium, serta Netflix Code bergaransi redeem 100%.",
      badge: "Instant Delivery",
      icon: "Ticket",
    },
    {
      id: "reseller-api",
      title: "Mitra Reseller & API Game",
      description:
        "Peluang kemitraan khusus UMKM, pengusaha warnet, dan platform top-up dengan sistem Open API siap integrasi dan harga grosir VIP.",
      badge: "Margin Maksimal",
      icon: "Layers",
    },
    {
      id: "battle-pass",
      title: "Pass Musiman & Token Turnamen",
      description:
        "Paket battle pass musiman, starlight member bulanan, token turnamen komunitas esports, serta bundle skin event eksklusif.",
      badge: "Resmi & Bebas Banned",
      icon: "Trophy",
    },
    {
      id: "loyalty-rewards",
      title: "Pribumar Rewards & Loyalty Point",
      description:
        "Kumpulkan poin cashback dari setiap nominal pembelian. Tukarkan reward point dengan voucher diskon tambahan atau item skin gratis.",
      badge: "Cashback Tiap Belanja",
      icon: "Sparkles",
    },
  ] as ServiceItem[],
  news: [
    {
      id: "promo-gebyar-push-rank",
      title: "Promo Gebyar Push Rank: Cashback 30% Diamond MLBB & Free Fire",
      excerpt:
        "Nikmati potongan spesial menyambut reset season baru dengan metode pembayaran QRIS & E-Wallet tanpa kuota batas transaksi.",
      content:
        "Pribumar Games kembali menghadirkan promo spektakuler untuk seluruh pejuang rank Mobile Legends dan Free Fire se-Jonggol Raya dan seluruh Indonesia. Selama periode event, dapatkan cashback langsung hingga 30% menggunakan metode pembayaran QRIS instan.",
      category: "PROMO",
      date: "14 Mei 2026",
      thumbnail: "/images/news-promo.svg",
      author: "Admin Pribumar",
    },
    {
      id: "kerjasama-turnamen-nasional",
      title: "Pribumar Games Resmi Jadi Official Top-Up Partner Turnamen Komunitas",
      excerpt:
        "Dukungan penuh kami terhadap regenerasi atlet esports tanah air melalui sponsorship turnamen berskala nasional dan regional.",
      content:
        "Sebagai wujud nyata komitmen mendukung ekosistem esports dari akar rumput, Pribumar Games resmi menjadi sponsor utama dan penyedia voucher resmi untuk rangkaian kejuaraan komunitas di berbagai kota.",
      category: "KERJASAMA",
      date: "10 Mei 2026",
      thumbnail: "/images/news-partner.svg",
      author: "Owner Pribumar",
    },
    {
      id: "edukasi-hindari-topup-ilegal",
      title: "Tips Menghindari Penipuan Top Up Ilegal & Akun Terkena Diamond Merah",
      excerpt:
        "Kenali ciri-ciri toko voucher bodong dan cara aman bertransaksi hanya lewat platform resmi bergaransi agar akun tetap terlindungi.",
      content:
        "Banyak pemain tergiur harga murah tidak masuk akal yang berujung pada minus balance atau banned permanen. Di Pribumar Games, seluruh produk bersumber dari jalur distribusi legal dengan invoice terverifikasi.",
      category: "EDUKASI",
      date: "04 Mei 2026",
      thumbnail: "/images/news-tips.svg",
      author: "Tim Keamanan Pribumar",
    },
  ] as NewsItem[],
  paymentMethods: [
    "QRIS",
    "BCA VA",
    "MANDIRI",
    "BRI VA",
    "BNI VA",
    "GOPAY",
    "OVO",
    "DANA",
    "SHOPEEPAY",
  ],
};
