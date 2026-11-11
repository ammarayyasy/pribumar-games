import fs from "fs";
import path from "path";

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: boolean;
  created_at: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface NewsRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "published" | "draft";
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrderRecord {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  game_id: string;
  game_name: string;
  item_id: string;
  item_name: string;
  price: number;
  account_id: string;
  zone_id: string;
  payment_method: string;
  whatsapp: string;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSchema {
  Roles: RoleRecord[];
  Users: UserRecord[];
  News: NewsRecord[];
  Orders: OrderRecord[];
}

const LOCAL_DB_PATH = path.join(process.cwd(), "src", "data", "db.json");

// Default seed data identical to setup.gs
const INITIAL_DATABASE: DatabaseSchema = {
  Roles: [
    {
      id: "role-admin",
      name: "admin",
      description: "Administrator sistem dengan hak akses penuh ke seluruh menu dan data",
      permissions: "manage_users,manage_roles,manage_news,view_dashboard",
      is_system: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "role-user",
      name: "user",
      description: "Pengguna umum platform Pribumar Games",
      permissions: "view_profile,make_order",
      is_system: true,
      created_at: new Date().toISOString(),
    },
  ],
  Users: [
    {
      id: "user-admin-default",
      name: "Owner Pribumar Admin",
      email: "admin@gmail.com",
      password_hash: "$2b$10$lItciORsJhYwDO3MExAQje.Eu0NsB/iD9K1PVOLbhbbIuDKgsqXSK", // Hash of 123456
      role_id: "role-admin",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  News: [
    {
      id: "news-1",
      title: "Promo Gebyar Push Rank: Cashback 30% Diamond MLBB & Free Fire",
      slug: "promo-gebyar-push-rank",
      excerpt:
        "Nikmati potongan spesial menyambut reset season baru dengan metode pembayaran QRIS & E-Wallet tanpa kuota batas transaksi.",
      content:
        "Pribumar Games kembali menghadirkan promo spektakuler untuk seluruh pejuang rank Mobile Legends dan Free Fire se-Jonggol Raya dan seluruh Indonesia. Selama periode event, dapatkan cashback langsung hingga 30% menggunakan metode pembayaran QRIS instan.",
      thumbnail_path: "/images/news-promo.svg",
      status: "published",
      author_id: "user-admin-default",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "news-2",
      title: "Pribumar Games Resmi Jadi Official Top-Up Partner Turnamen Komunitas",
      slug: "kerjasama-turnamen-nasional",
      excerpt:
        "Dukungan penuh kami terhadap regenerasi atlet esports tanah air melalui sponsorship turnamen berskala nasional dan regional.",
      content:
        "Sebagai wujud nyata komitmen mendukung ekosistem esports dari akar rumput, Pribumar Games resmi menjadi sponsor utama dan penyedia voucher resmi untuk rangkaian kejuaraan komunitas di berbagai kota.",
      thumbnail_path: "/images/news-partner.svg",
      status: "published",
      author_id: "user-admin-default",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "news-3",
      title: "Tips Menghindari Penipuan Top Up Ilegal & Akun Terkena Diamond Merah",
      slug: "edukasi-hindari-topup-ilegal",
      excerpt:
        "Kenali ciri-ciri toko voucher bodong dan cara aman bertransaksi hanya lewat platform resmi bergaransi agar akun tetap terlindungi.",
      content:
        "Banyak pemain tergiur harga murah tidak masuk akal yang berujung pada minus balance atau banned permanen. Di Pribumar Games, seluruh produk bersumber dari jalur distribusi legal dengan invoice terverifikasi.",
      thumbnail_path: "/images/news-tips.svg",
      status: "published",
      author_id: "user-admin-default",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  Orders: [],
};

function getLocalDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const dir = path.dirname(LOCAL_DB_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(INITIAL_DATABASE, null, 2), "utf8");
      return INITIAL_DATABASE;
    }
    const raw = fs.readFileSync(LOCAL_DB_PATH, "utf8");
    const parsed = JSON.parse(raw);
    parsed.Roles = parsed.Roles || [];
    parsed.Users = parsed.Users || [];
    parsed.News = parsed.News || [];
    parsed.Orders = parsed.Orders || [];
    return parsed;
  } catch (err) {
    console.error("Local DB read error, using fallback memory state:", err);
    return INITIAL_DATABASE;
  }
}

function saveLocalDb(data: DatabaseSchema) {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Local DB save error:", err);
  }
}

/**
 * Universal Database Client:
 * Menghubungkan ke Google Apps Script Web App jika APPS_SCRIPT_URL disetel,
 * atau menggunakan local JSON database sebagai fallback terisolasi.
 */
export const db = {
  async isAppsScriptConfigured(): Promise<boolean> {
    return Boolean(
      process.env.APPS_SCRIPT_URL &&
        process.env.APPS_SCRIPT_URL.startsWith("https://script.google.com")
    );
  },

  async queryAppsScript<T>(payload: any): Promise<{ success: boolean; data?: T; error?: string }> {
    const url = process.env.APPS_SCRIPT_URL;
    const secret = process.env.APPS_SCRIPT_SECRET;

    if (!url) {
      throw new Error("APPS_SCRIPT_URL belum disetel.");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret }),
    });

    if (!response.ok) {
      throw new Error(`Apps Script HTTP Error: ${response.status}`);
    }

    return await response.json();
  },

  // 1. Roles
  async getRoles(): Promise<RoleRecord[]> {
    if (await this.isAppsScriptConfigured()) {
      try {
        const res = await this.queryAppsScript<RoleRecord[]>({ action: "findAll", table: "Roles" });
        if (res.success && Array.isArray(res.data)) return res.data;
      } catch (e) {
        console.warn("Apps Script query failed, falling back to local DB:", e);
      }
    }
    const local = getLocalDb();
    return local.Roles;
  },

  async createRole(role: Omit<RoleRecord, "id" | "created_at">): Promise<RoleRecord> {
    const newRole: RoleRecord = {
      ...role,
      id: `role-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    if (await this.isAppsScriptConfigured()) {
      try {
        await this.queryAppsScript({ action: "insert", table: "Roles", data: newRole });
      } catch (e) {
        console.warn("Apps Script insert role failed:", e);
      }
    }

    const local = getLocalDb();
    local.Roles.push(newRole);
    saveLocalDb(local);
    return newRole;
  },

  async updateRole(id: string, updates: Partial<RoleRecord>): Promise<boolean> {
    if (await this.isAppsScriptConfigured()) {
      try {
        await this.queryAppsScript({ action: "update", table: "Roles", id, data: updates });
      } catch (e) {
        console.warn("Apps Script update role failed:", e);
      }
    }

    const local = getLocalDb();
    const index = local.Roles.findIndex((r) => r.id === id);
    if (index !== -1) {
      local.Roles[index] = { ...local.Roles[index], ...updates };
      saveLocalDb(local);
      return true;
    }
    return false;
  },

  async deleteRole(id: string): Promise<boolean> {
    const local = getLocalDb();
    const role = local.Roles.find((r) => r.id === id);
    if (role && role.is_system) {
      throw new Error("Role bawaan sistem tidak boleh dihapus.");
    }

    if (await this.isAppsScriptConfigured()) {
      try {
        await this.queryAppsScript({ action: "delete", table: "Roles", id });
      } catch (e) {
        console.warn("Apps Script delete role failed:", e);
      }
    }

    local.Roles = local.Roles.filter((r) => r.id !== id);
    saveLocalDb(local);
    return true;
  },

  // 2. Users
  async getUsers(): Promise<UserRecord[]> {
    if (await this.isAppsScriptConfigured()) {
      try {
        const res = await this.queryAppsScript<UserRecord[]>({ action: "findAll", table: "Users" });
        if (res.success && Array.isArray(res.data)) return res.data;
      } catch (e) {
        console.warn("Apps Script query failed, falling back to local DB:", e);
      }
    }
    const local = getLocalDb();
    return local.Users;
  },

  async findUserByEmail(email: string): Promise<UserRecord | null> {
    const users = await this.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id: string): Promise<UserRecord | null> {
    const users = await this.getUsers();
    return users.find((u) => u.id === id) || null;
  },

  async createUser(user: Omit<UserRecord, "id" | "created_at" | "updated_at">): Promise<UserRecord> {
    const newUser: UserRecord = {
      ...user,
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (await this.isAppsScriptConfigured()) {
      try {
        await this.queryAppsScript({ action: "insert", table: "Users", data: newUser });
      } catch (e) {
        console.warn("Apps Script insert user failed:", e);
      }
    }

    const local = getLocalDb();
    local.Users.push(newUser);
    saveLocalDb(local);
    return newUser;
  },

  async updateUser(id: string, updates: Partial<UserRecord>): Promise<boolean> {
    const finalUpdates = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (await this.isAppsScriptConfigured()) {
      try {
        await this.queryAppsScript({ action: "update", table: "Users", id, data: finalUpdates });
      } catch (e) {
        console.warn("Apps Script update user failed:", e);
      }
    }

    const local = getLocalDb();
    const index = local.Users.findIndex((u) => u.id === id);
    if (index !== -1) {
      local.Users[index] = { ...local.Users[index], ...finalUpdates };
      saveLocalDb(local);
      return true;
    }
    return false;
  },

  async deleteUser(id: string): Promise<boolean> {
    if (await this.isAppsScriptConfigured()) {
      try {
        await this.queryAppsScript({ action: "delete", table: "Users", id });
      } catch (e) {
        console.warn("Apps Script delete user failed:", e);
      }
    }

    const local = getLocalDb();
    local.Users = local.Users.filter((u) => u.id !== id);
    saveLocalDb(local);
    return true;
  },

  // 3. News (CRUD Berita)
  async getNews(): Promise<NewsRecord[]> {
    if (await this.isAppsScriptConfigured()) {
      try {
        const res = await this.queryAppsScript<NewsRecord[]>({ action: "findAll", table: "News" });
        if (res.success && Array.isArray(res.data)) return res.data;
      } catch (e) {
        console.warn("Apps Script query news failed, falling back to local DB:", e);
      }
    }
    const local = getLocalDb();
    return local.News;
  },

  async createNews(newsItem: Omit<NewsRecord, "id" | "created_at" | "updated_at">): Promise<NewsRecord> {
    const newItem: NewsRecord = {
      ...newsItem,
      id: `news-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (await this.isAppsScriptConfigured()) {
      try {
        await this.queryAppsScript({ action: "insert", table: "News", data: newItem });
      } catch (e) {
        console.warn("Apps Script insert news failed:", e);
      }
    }

    const local = getLocalDb();
    local.News.unshift(newItem);
    saveLocalDb(local);
    return newItem;
  },

  async updateNews(id: string, updates: Partial<NewsRecord>): Promise<boolean> {
    const finalUpdates = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (await this.isAppsScriptConfigured()) {
      try {
        await this.queryAppsScript({ action: "update", table: "News", id, data: finalUpdates });
      } catch (e) {
        console.warn("Apps Script update news failed:", e);
      }
    }

    const local = getLocalDb();
    const index = local.News.findIndex((n) => n.id === id);
    if (index !== -1) {
      local.News[index] = { ...local.News[index], ...finalUpdates };
      saveLocalDb(local);
      return true;
    }
    return false;
  },

  async deleteNews(id: string): Promise<boolean> {
    if (await this.isAppsScriptConfigured()) {
      try {
        await this.queryAppsScript({ action: "delete", table: "News", id });
      } catch (e) {
        console.warn("Apps Script delete news failed:", e);
      }
    }

    const local = getLocalDb();
    local.News = local.News.filter((n) => n.id !== id);
    saveLocalDb(local);
    return true;
  },

  // 4. Orders (CRUD Tiket Pemesanan Top Up)
  async getOrders(): Promise<OrderRecord[]> {
    if (await this.isAppsScriptConfigured()) {
      try {
        const res = await this.queryAppsScript<OrderRecord[]>({ action: "findAll", table: "Orders" });
        if (res.success && Array.isArray(res.data)) return res.data;
      } catch (e) {
        console.warn("Apps Script query orders failed, falling back to local DB:", e);
      }
    }
    const local = getLocalDb();
    return local.Orders || [];
  },

  async getOrdersByUserId(userId: string): Promise<OrderRecord[]> {
    const all = await this.getOrders();
    return all.filter((o) => String(o.user_id) === String(userId));
  },

  async findOrderById(id: string): Promise<OrderRecord | null> {
    const all = await this.getOrders();
    return all.find((o) => String(o.id).toUpperCase() === String(id).toUpperCase()) || null;
  },

  async createOrder(order: Omit<OrderRecord, "created_at" | "updated_at">): Promise<OrderRecord> {
    const newOrder: OrderRecord = {
      ...order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (await this.isAppsScriptConfigured()) {
      try {
        await this.queryAppsScript({ action: "insert", table: "Orders", data: newOrder });
      } catch (e) {
        console.warn("Apps Script insert order failed:", e);
      }
    }

    const local = getLocalDb();
    if (!local.Orders) local.Orders = [];
    local.Orders.unshift(newOrder);
    saveLocalDb(local);
    return newOrder;
  },

  async updateOrder(id: string, updates: Partial<OrderRecord>): Promise<boolean> {
    const finalUpdates = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (await this.isAppsScriptConfigured()) {
      try {
        await this.queryAppsScript({ action: "update", table: "Orders", id, data: finalUpdates });
      } catch (e) {
        console.warn("Apps Script update order failed:", e);
      }
    }

    const local = getLocalDb();
    if (!local.Orders) local.Orders = [];
    const index = local.Orders.findIndex((o) => String(o.id).toUpperCase() === String(id).toUpperCase());
    if (index !== -1) {
      local.Orders[index] = { ...local.Orders[index], ...finalUpdates };
      saveLocalDb(local);
      return true;
    }
    return false;
  },
};

