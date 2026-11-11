"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  Users,
  Shield,
  Newspaper,
  KeyRound,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  Search,
  Upload,
  Globe,
  Loader2,
  Lock,
  Layers,
  Database,
  Eye,
  Check,
  X,
  ShoppingBag,
  Phone,
  MessageCircle,
  Clock,
  QrCode,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "news" | "orders" | "security">("orders");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [usersList, setUsersList] = useState<any[]>([]);
  const [rolesList, setRolesList] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);

  // Search & Filter
  const [userSearch, setUserSearch] = useState("");
  const [newsSearch, setNewsSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Modals & Forms
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // News Form
  const [newsTitle, setNewsTitle] = useState("");
  const [newsExcerpt, setNewsExcerpt] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsThumbnail, setNewsThumbnail] = useState("");
  const [newsStatus, setNewsStatus] = useState("published");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Role Form
  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [rolePerms, setRolePerms] = useState("manage_news,view_dashboard");

  // User Form
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRoleId, setUserRoleId] = useState("");

  // Security (Change Password)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityMsg, setSecurityMsg] = useState("");
  const [securityErr, setSecurityErr] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);

  // Status & Notification
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const formatDate = (dateStr: any) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? String(dateStr) : d.toLocaleDateString("id-ID");
    } catch {
      return String(dateStr);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      // Verify session
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.push("/login?callbackUrl=/dashboard");
        return;
      }
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== "admin") {
        router.push("/login?callbackUrl=/dashboard");
        return;
      }
      setCurrentUser(meData.user);

      // Fetch users
      try {
        const usersRes = await fetch("/api/admin/users");
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (usersData.success) {
            setUsersList(usersData.users || []);
            setRolesList(usersData.roles || []);
            if (usersData.roles && usersData.roles.length > 0) {
              setUserRoleId((prev) => prev || usersData.roles[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Fetch users error:", err);
      }

      // Fetch news
      try {
        const newsRes = await fetch("/api/admin/news");
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          if (newsData.success) {
            setNewsList(newsData.news || []);
          }
        }
      } catch (err) {
        console.error("Fetch news error:", err);
      }

      // Fetch orders (Step 3)
      try {
        const ordersRes = await fetch("/api/admin/orders");
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (ordersData.success) {
            setOrdersList(ordersData.orders || []);
          }
        }
      } catch (err) {
        console.error("Fetch orders error:", err);
      }
    } catch (err) {
      console.error("Dashboard load data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || `Status pesanan #${orderId} diubah.`);
        loadData();
      } else {
        alert(data.error || "Gagal memperbarui status pesanan.");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  // User Actions
  const toggleUserStatus = async (user: any) => {
    if (user.id === currentUser?.id) {
      alert("Anda tidak dapat menonaktifkan akun admin Anda sendiri!");
      return;
    }
    const newStatus = user.status === "active" ? "inactive" : "active";
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, status: newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      showToast(`Status user ${user.name} diubah menjadi ${newStatus}.`);
      loadData();
    } else {
      alert(data.error);
    }
  };

  const handleChangeUserRole = async (userId: string, newRoleId: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, role_id: newRoleId }),
    });
    const data = await res.json();
    if (data.success) {
      showToast("Role pengguna berhasil diubah.");
      loadData();
    } else {
      alert(data.error);
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (user.id === currentUser?.id) {
      alert("Anda tidak dapat menghapus akun admin Anda sendiri!");
      return;
    }
    if (!confirm(`Yakin ingin menghapus pengguna "${user.name}"?`)) return;

    const res = await fetch(`/api/admin/users?id=${user.id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      showToast("Pengguna berhasil dihapus.");
      loadData();
    } else {
      alert(data.error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userName,
        email: userEmail,
        password: userPassword,
        role_id: userRoleId || rolesList[0]?.id,
      }),
    });
    const data = await res.json();
    if (data.success) {
      showToast("User baru berhasil ditambahkan!");
      setShowUserModal(false);
      setUserName("");
      setUserEmail("");
      setUserPassword("");
      loadData();
    } else {
      alert(data.error);
    }
  };

  // Role Actions
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: roleName,
        description: roleDesc,
        permissions: rolePerms,
      }),
    });
    const data = await res.json();
    if (data.success) {
      showToast("Role baru berhasil dibuat!");
      setShowRoleModal(false);
      setRoleName("");
      setRoleDesc("");
      loadData();
    } else {
      alert(data.error);
    }
  };

  const handleDeleteRole = async (role: any) => {
    if (role.is_system) {
      alert("Role bawaan sistem tidak boleh dihapus.");
      return;
    }
    if (!confirm(`Hapus role "${role.name}"?`)) return;

    const res = await fetch(`/api/admin/roles?id=${role.id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      showToast("Role berhasil dihapus.");
      loadData();
    } else {
      alert(data.error);
    }
  };

  // News Actions & Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setNewsThumbnail(data.path);
        showToast("Gambar thumbnail berhasil diupload ke public/uploads/!");
      } else {
        alert(data.error || "Gagal upload gambar.");
      }
    } catch (err: any) {
      alert("Gagal koneksi upload gambar.");
    } finally {
      setUploadingImage(false);
    }
  };

  const openCreateNewsModal = () => {
    setEditingItem(null);
    setNewsTitle("");
    setNewsExcerpt("");
    setNewsContent("");
    setNewsThumbnail("/images/news-promo.svg");
    setNewsStatus("published");
    setShowNewsModal(true);
  };

  const openEditNewsModal = (article: any) => {
    setEditingItem(article);
    setNewsTitle(article.title);
    setNewsExcerpt(article.excerpt);
    setNewsContent(article.content);
    setNewsThumbnail(article.thumbnail_path);
    setNewsStatus(article.status);
    setShowNewsModal(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      // Update
      const res = await fetch("/api/admin/news", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem.id,
          title: newsTitle,
          excerpt: newsExcerpt,
          content: newsContent,
          thumbnail_path: newsThumbnail,
          status: newsStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Berita berhasil diperbarui!");
        setShowNewsModal(false);
        loadData();
      } else {
        alert(data.error);
      }
    } else {
      // Create
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newsTitle,
          excerpt: newsExcerpt,
          content: newsContent,
          thumbnail_path: newsThumbnail,
          status: newsStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Berita baru berhasil ditambahkan ke database!");
        setShowNewsModal(false);
        loadData();
      } else {
        alert(data.error);
      }
    }
  };

  const handleDeleteNews = async (article: any) => {
    if (!confirm(`Hapus berita "${article.title}"?`)) return;

    const res = await fetch(`/api/admin/news?id=${article.id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      showToast("Berita berhasil dihapus dari database.");
      loadData();
    } else {
      alert(data.error);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMsg("");
    setSecurityErr("");
    setSecurityLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setSecurityMsg("Password admin berhasil diperbarui!");
        setOldPassword("");
        setNewPassword("");
      } else {
        setSecurityErr(data.error || "Gagal memperbarui password.");
      }
    } catch (err: any) {
      setSecurityErr("Terjadi kesalahan jaringan.");
    } finally {
      setSecurityLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        <span className="ml-3 font-bold text-sm">Memuat Dashboard Pribumar Games...</span>
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredNews = newsList.filter(
    (n) =>
      n.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(newsSearch.toLowerCase())
  );

  const pendingOrdersCount = ordersList.filter(
    (o) => o.status === "menunggu_konfirmasi"
  ).length;

  const filteredOrders = ordersList.filter((ord) => {
    const q = orderSearch.toLowerCase();
    const matchesSearch =
      (ord.id && ord.id.toLowerCase().includes(q)) ||
      (ord.user_name && ord.user_name.toLowerCase().includes(q)) ||
      (ord.game_name && ord.game_name.toLowerCase().includes(q)) ||
      (ord.account_id && ord.account_id.toLowerCase().includes(q)) ||
      (ord.whatsapp && ord.whatsapp.toLowerCase().includes(q));

    const matchesStatus =
      orderStatusFilter === "all" || ord.status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-secondary-container text-on-secondary-container px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-secondary text-sm font-bold animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-secondary" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="h-16 bg-surface-container border-b border-outline-variant/30 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="relative w-8 h-8">
            <Image src={siteConfig.logo} alt="Logo" width={32} height={32} className="object-contain" />
          </div>
          <span className="font-headline-sm text-base font-bold text-on-surface">
            {siteConfig.name} <span className="text-secondary text-xs font-normal">| Admin Workspace</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Lihat Website</span>
          </Link>

          <div className="h-6 w-px bg-outline-variant/30 hidden sm:block" />

          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-on-surface">{currentUser?.name}</div>
            <div className="text-[10px] text-secondary font-mono">{currentUser?.email}</div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-surface-container-high hover:bg-error-container hover:text-error text-on-surface-variant transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-surface-container-low border-r border-outline-variant/20 p-4 space-y-1 shrink-0">
          <div className="text-[11px] font-bold text-outline px-3 py-2 uppercase tracking-wider">
            Menu Manajemen
          </div>

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "users"
                ? "bg-primary-container text-on-primary-container shadow"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Manajemen User</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container">
              {usersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("roles")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "roles"
                ? "bg-primary-container text-on-primary-container shadow"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4" />
              <span>Manajemen Role</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container">
              {rolesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "news"
                ? "bg-primary-container text-on-primary-container shadow"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Newspaper className="w-4 h-4" />
              <span>CRUD Berita &amp; Promo</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container">
              {newsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "orders"
                ? "bg-primary-container text-on-primary-container shadow"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-secondary" />
              <span>Manajemen Pesanan</span>
            </div>
            {pendingOrdersCount > 0 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed animate-pulse">
                {pendingOrdersCount} Baru
              </span>
            ) : (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container">
                {ordersList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "security"
                ? "bg-primary-container text-on-primary-container shadow"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Ganti Password Admin</span>
          </button>

          {/* Database Info Box */}
          <div className="pt-6 mt-6 border-t border-outline-variant/20">
            <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant space-y-1.5">
              <div className="font-bold text-on-surface flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-secondary" />
                <span>Konektivitas Database</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Tersinkronisasi otomatis dengan Google Spreadsheet Apps Script (atau local persistent fallback).
              </p>
            </div>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* TAB 1: MANAJEMEN USER */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-headline-sm text-xl font-bold text-on-surface">
                    Manajemen Pengguna (Users)
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Kelola akun terdaftar, hak akses peran, serta aktivasi status
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-48 sm:w-64">
                    <Search className="w-4 h-4 text-outline absolute left-3 top-3" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Cari user / email..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah User</span>
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="rounded-2xl bg-surface-container border border-outline-variant/30 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container-high text-on-surface-variant border-b border-outline-variant/30">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Nama &amp; Email</th>
                        <th className="py-3 px-4 font-semibold">Role</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold">Terdaftar</th>
                        <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-outline">
                            Tidak ada data pengguna ditemukan.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => {
                          const isMe = u.id === currentUser?.id;
                          return (
                            <tr key={u.id} className="hover:bg-surface-container-high/50 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-sm text-on-surface flex items-center gap-2">
                                  <span>{u.name}</span>
                                  {isMe && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold">
                                      Anda
                                    </span>
                                  )}
                                </div>
                                <div className="text-on-surface-variant font-mono text-xs">{u.email}</div>
                              </td>
                              <td className="py-3.5 px-4">
                                <select
                                  disabled={isMe}
                                  value={u.role_id}
                                  onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                                  className="px-2.5 py-1 rounded-lg bg-surface-container-high border border-outline-variant/30 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                                >
                                  {rolesList.map((r) => (
                                    <option key={r.id} value={r.id}>
                                      {r.name.toUpperCase()}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-3.5 px-4">
                                <button
                                  disabled={isMe}
                                  onClick={() => toggleUserStatus(u)}
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider transition-all disabled:opacity-60 ${
                                    u.status === "active"
                                      ? "bg-secondary-fixed/20 text-secondary border border-secondary/40"
                                      : "bg-surface-container-high text-outline border border-outline-variant/30"
                                  }`}
                                >
                                  {u.status === "active" ? "AKTIF" : "NONAKTIF"}
                                </button>
                              </td>
                              <td className="py-3.5 px-4 text-on-surface-variant text-[11px]">
                                {formatDate(u.created_at)}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  disabled={isMe}
                                  onClick={() => handleDeleteUser(u)}
                                  className="p-1.5 rounded-lg bg-surface-container-high text-outline hover:text-error hover:bg-error-container/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                  title={isMe ? "Tidak bisa menghapus akun sendiri" : "Hapus Pengguna"}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAJEMEN ROLE */}
          {activeTab === "roles" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-headline-sm text-xl font-bold text-on-surface">
                    Manajemen Peran (Roles)
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Kelola hak akses dan jenis peranan dalam platform
                  </p>
                </div>
                <button
                  onClick={() => setShowRoleModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Role Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rolesList.map((role) => (
                  <div
                    key={role.id}
                    className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-secondary" />
                          <h3 className="font-bold text-base text-on-surface uppercase tracking-wide">
                            {role.name}
                          </h3>
                        </div>
                        {role.is_system ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold">
                            Sistem Bawaan
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-bold">
                            Kustom
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                        {role.description}
                      </p>
                      <div className="p-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20 text-[11px] font-mono text-outline">
                        Permissions: <span className="text-secondary">{role.permissions}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                      <span className="text-[11px] text-on-surface-variant">
                        ID: {role.id}
                      </span>
                      {!role.is_system && (
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="text-xs text-error hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Role</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CRUD BERITA */}
          {activeTab === "news" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-headline-sm text-xl font-bold text-on-surface">
                    CRUD Berita &amp; Artikel Promo
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Data berita langsung tampil di landing page dan terhubung ke spreadsheet
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-48 sm:w-64">
                    <Search className="w-4 h-4 text-outline absolute left-3 top-3" />
                    <input
                      type="text"
                      value={newsSearch}
                      onChange={(e) => setNewsSearch(e.target.value)}
                      placeholder="Cari berita..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={openCreateNewsModal}
                    className="px-3.5 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tulis Berita Baru</span>
                  </button>
                </div>
              </div>

              {/* News Grid */}
              {filteredNews.length === 0 ? (
                <div className="p-8 text-center text-outline bg-surface-container rounded-2xl border border-outline-variant/30">
                  Tidak ada data berita atau artikel promo ditemukan.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredNews.map((article) => (
                    <div
                      key={article.id}
                      className="rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/30 shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-40 bg-surface-container-high overflow-hidden">
                          <Image
                            src={article.thumbnail_path || "/images/news-promo.svg"}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                          <span
                            className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              article.status === "published"
                                ? "bg-secondary-fixed text-on-secondary-fixed"
                                : "bg-surface-container text-outline"
                            }`}
                          >
                            {article.status}
                          </span>
                        </div>

                        <div className="p-4">
                          <div className="text-[11px] text-on-surface-variant mb-1">
                            {formatDate(article.created_at)}
                          </div>
                          <h3 className="font-bold text-sm text-on-surface mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 border-t border-outline-variant/15 flex items-center justify-between mt-2">
                        <Link
                          href={`/news/${article.slug || article.id}`}
                          target="_blank"
                          className="text-xs text-secondary hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Pratinjau</span>
                        </Link>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditNewsModal(article)}
                            className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface transition-colors"
                            title="Edit Berita"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNews(article)}
                            className="p-1.5 rounded-lg bg-surface-container-high hover:bg-error-container hover:text-error text-outline transition-colors"
                            title="Hapus Berita"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MANAJEMEN PESANAN MASUK (STEP 3) */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-headline-sm text-xl font-bold text-on-surface flex items-center gap-2">
                    <span>Manajemen Pesanan Masuk (Top Up Game)</span>
                    {pendingOrdersCount > 0 && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold animate-pulse">
                        {pendingOrdersCount} Menunggu Konfirmasi
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Verifikasi pembayaran QRIS, konfirmasi voucher game, dan hubungi pelanggan via WhatsApp
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-48 sm:w-64">
                    <Search className="w-4 h-4 text-outline absolute left-3 top-3" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Cari no tiket, nama, game, WA..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Status Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                <button
                  onClick={() => setOrderStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    orderStatusFilter === "all"
                      ? "bg-secondary-fixed text-on-secondary-fixed shadow"
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  Semua ({ordersList.length})
                </button>
                <button
                  onClick={() => setOrderStatusFilter("menunggu_konfirmasi")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    orderStatusFilter === "menunggu_konfirmasi"
                      ? "bg-primary-container text-on-primary-container shadow"
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  <span>Menunggu Konfirmasi ({ordersList.filter((o) => o.status === "menunggu_konfirmasi").length})</span>
                </button>
                <button
                  onClick={() => setOrderStatusFilter("dikonfirmasi")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    orderStatusFilter === "dikonfirmasi"
                      ? "bg-secondary-container text-on-secondary-container shadow"
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                  <span>Dikonfirmasi ({ordersList.filter((o) => o.status === "dikonfirmasi").length})</span>
                </button>
                <button
                  onClick={() => setOrderStatusFilter("dibatalkan")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    orderStatusFilter === "dibatalkan"
                      ? "bg-error-container text-error shadow"
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Dibatalkan ({ordersList.filter((o) => o.status === "dibatalkan").length})</span>
                </button>
              </div>

              {/* Orders Table */}
              <div className="rounded-2xl bg-surface-container border border-outline-variant/30 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container-high text-on-surface-variant border-b border-outline-variant/30">
                      <tr>
                        <th className="py-3 px-4 font-semibold">No. Tiket &amp; Tanggal</th>
                        <th className="py-3 px-4 font-semibold">Pelanggan &amp; WhatsApp</th>
                        <th className="py-3 px-4 font-semibold">Game &amp; Item</th>
                        <th className="py-3 px-4 font-semibold">Data Akun Game</th>
                        <th className="py-3 px-4 font-semibold">Total Tagihan</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Aksi Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-outline">
                            Tidak ada data pesanan yang sesuai dengan filter atau pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord: any) => {
                          const cleanWa = String(ord.whatsapp || "").replace(/^0/, "62").replace(/[^0-9]/g, "");
                          const waText = encodeURIComponent(
                            `Halo ${ord.user_name || "Pelanggan Pribumar Games"}, kami dari Admin Pribumar Games terkait pesanan #${ord.id} (${ord.game_name} - ${ord.item_name}).`
                          );
                          const waHref = `https://wa.me/${cleanWa}?text=${waText}`;

                          return (
                            <tr key={ord.id} className="hover:bg-surface-container-high/50 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="font-mono font-bold text-secondary text-sm flex items-center gap-1.5">
                                  <span>#{ord.id}</span>
                                </div>
                                <div className="text-on-surface-variant text-[11px] mt-0.5">
                                  {formatDate(ord.created_at)}
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-bold text-on-surface">{ord.user_name}</div>
                                <div className="text-on-surface-variant text-[11px] font-mono">{ord.whatsapp}</div>
                                <div className="text-[10px] text-outline truncate max-w-[140px]">{ord.user_email}</div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-bold text-on-surface">{ord.game_name}</div>
                                <div className="text-secondary font-semibold text-[11px]">{ord.item_name}</div>
                                <div className="text-[10px] text-outline">Metode: {ord.payment_method}</div>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-mono font-bold text-on-surface">
                                  {ord.account_id}
                                </div>
                                {ord.zone_id && (
                                  <div className="text-[11px] text-on-surface-variant font-mono">
                                    Server: ({ord.zone_id})
                                  </div>
                                )}
                              </td>

                              <td className="py-3.5 px-4 font-mono font-bold text-sm text-secondary">
                                Rp {Number(ord.price).toLocaleString("id-ID")}
                              </td>

                              <td className="py-3.5 px-4">
                                {ord.status === "menunggu_konfirmasi" && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container border border-primary/40 uppercase">
                                    <Clock className="w-3 h-3 text-secondary animate-pulse" />
                                    <span>Menunggu</span>
                                  </span>
                                )}
                                {ord.status === "dikonfirmasi" && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-secondary-fixed/20 text-secondary border border-secondary/40 uppercase">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Sukses</span>
                                  </span>
                                )}
                                {ord.status === "dibatalkan" && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-error-container text-error border border-error/30 uppercase">
                                    <X className="w-3 h-3" />
                                    <span>Dibatalkan</span>
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {ord.status === "menunggu_konfirmasi" && (
                                    <>
                                      <button
                                        onClick={() => handleUpdateOrderStatus(ord.id, "dikonfirmasi")}
                                        className="px-2.5 py-1 rounded-lg bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold shadow hover:bg-secondary-fixed-dim transition-colors"
                                        title="Konfirmasi Pembayaran & Selesaikan"
                                      >
                                        Konfirmasi
                                      </button>
                                      <button
                                        onClick={() => handleUpdateOrderStatus(ord.id, "dibatalkan")}
                                        className="p-1 rounded-lg bg-surface-container-high text-outline hover:text-error hover:bg-error-container/30 transition-colors"
                                        title="Tolak / Batalkan Pesanan"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}

                                  {ord.status === "dikonfirmasi" && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(ord.id, "dibatalkan")}
                                      className="px-2 py-1 rounded-lg bg-surface-container-high hover:bg-error-container/30 text-outline hover:text-error text-[10px] font-semibold transition-colors"
                                      title="Batalkan jika ada kesalahan"
                                    >
                                      Batalkan
                                    </button>
                                  )}

                                  {ord.status === "dibatalkan" && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(ord.id, "menunggu_konfirmasi")}
                                      className="px-2 py-1 rounded-lg bg-surface-container-high hover:bg-surface-variant text-outline hover:text-on-surface text-[10px] font-semibold transition-colors"
                                      title="Kembalikan ke Menunggu"
                                    >
                                      Pulihkan
                                    </button>
                                  )}

                                  {/* Tombol Hubungi WhatsApp Pembeli */}
                                  <a
                                    href={waHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-surface-container-high text-secondary hover:bg-secondary-container hover:text-on-secondary-container transition-colors"
                                    title="Hubungi Pembeli via WhatsApp"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>

                                  {/* Link Pratinjau Lembar QRIS */}
                                  <Link
                                    href={`/payment/${ord.id}`}
                                    target="_blank"
                                    className="p-1.5 rounded-lg bg-surface-container-high text-outline hover:text-on-surface hover:bg-surface-variant transition-colors"
                                    title="Lihat Lembar Pembayaran QRIS"
                                  >
                                    <ArrowUpRight className="w-4 h-4" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KEAMANAN & GANTI PASSWORD */}
          {activeTab === "security" && (
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <h2 className="font-headline-sm text-xl font-bold text-on-surface">
                  Keamanan &amp; Ganti Password Admin
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Perbarui kata sandi admin default (123456) demi keamanan website sebelum rilis ke publik
                </p>
              </div>

              {/* Warning Box */}
              <div className="p-4 rounded-2xl bg-primary-container/20 border border-primary/40 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div className="text-xs text-on-surface-variant leading-relaxed">
                  <span className="font-bold text-on-surface">Peringatan Keamanan Wajib:</span> Akun admin awal disetel dengan password lemah <code>123456</code>. Sangat disarankan mengganti password dengan kombinasi huruf dan angka sebelum melakukan publikasi/deploy ke Vercel.
                </div>
              </div>

              {securityMsg && (
                <div className="p-3.5 rounded-xl bg-secondary-container/40 border border-secondary text-secondary text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{securityMsg}</span>
                </div>
              )}

              {securityErr && (
                <div className="p-3.5 rounded-xl bg-error-container/40 border border-error text-error text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{securityErr}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 rounded-2xl bg-surface-container border border-outline-variant/30 p-6 shadow-xl">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Password Lama
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-outline absolute left-3 top-3.5" />
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Masukkan password saat ini (cth: 123456)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Password Baru (min. 6 karakter)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-outline absolute left-3 top-3.5" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan password baru yang kuat"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={securityLoading}
                  className="w-full py-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-sm shadow hover:bg-secondary-fixed-dim transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {securityLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{securityLoading ? "Memperbarui..." : "Simpan Password Baru"}</span>
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: Tambah User */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-surface-container border border-outline-variant/30 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowUserModal(false)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-lg text-on-surface mb-4">Tambah Pengguna Baru</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Pilih Peran (Role)</label>
                <select
                  value={userRoleId}
                  onChange={(e) => setUserRoleId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-sm"
                >
                  {rolesList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name.toUpperCase()} - {r.description.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-sm"
              >
                Simpan Pengguna
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tambah Role */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-surface-container border border-outline-variant/30 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowRoleModal(false)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-lg text-on-surface mb-4">Tambah Role Baru</h3>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Nama Role (Huruf kecil)</label>
                <input
                  type="text"
                  required
                  placeholder="editor / finance / support"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Deskripsi</label>
                <textarea
                  required
                  rows={2}
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  placeholder="Deskripsi tugas dan peranan..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Permissions (Pisahkan koma)</label>
                <input
                  type="text"
                  value={rolePerms}
                  onChange={(e) => setRolePerms(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-sm font-mono text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-sm"
              >
                Buat Role
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tulis / Edit Berita */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-surface-container border border-outline-variant/30 rounded-2xl p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setShowNewsModal(false)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-lg text-on-surface mb-4">
              {editingItem ? "Edit Berita / Promo" : "Tulis Berita Baru"}
            </h3>

            <form onSubmit={handleSaveNews} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Judul Berita</label>
                <input
                  type="text"
                  required
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Contoh: Promo Gebyar Diamonds MLBB Akhir Pekan"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Ringkasan (Excerpt)</label>
                <textarea
                  required
                  rows={2}
                  value={newsExcerpt}
                  onChange={(e) => setNewsExcerpt(e.target.value)}
                  placeholder="Deskripsi singkat yang tampil pada kartu landing page..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Konten Lengkap</label>
                <textarea
                  required
                  rows={5}
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="Isi narasi berita selengkapnya..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-sm"
                />
              </div>

              {/* Upload Thumbnail Media Lokal */}
              <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-secondary" />
                    <span>Upload Thumbnail Media Lokal (`public/uploads/`)</span>
                  </label>
                  {uploadingImage && (
                    <span className="text-xs text-secondary flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-secondary-fixed file:text-on-secondary-fixed hover:file:bg-secondary-fixed-dim cursor-pointer"
                  />
                  <div className="text-[11px] text-outline truncate max-w-xs">
                    Path: {newsThumbnail}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Status Publikasi</label>
                <select
                  value={newsStatus}
                  onChange={(e) => setNewsStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-sm"
                >
                  <option value="published">Published (Langsung Tampil di Landing Page)</option>
                  <option value="draft">Draft (Disimpan Sementara)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowNewsModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container-high text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-xs shadow"
                >
                  Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

