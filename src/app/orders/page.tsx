"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  QrCode,
  MessageCircle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Gamepad2,
} from "lucide-react";

export default function UserOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserOrders = async () => {
    try {
      setRefreshing(true);
      // 1. Cek sesi login
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.push("/login?callbackUrl=/orders");
        return;
      }
      const meData = await meRes.json();
      if (!meData.user) {
        router.push("/login?callbackUrl=/orders");
        return;
      }
      setUser(meData.user);

      // 2. Ambil tiket pesanan milik user
      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      if (ordersData.success && Array.isArray(ordersData.orders)) {
        setOrders(ordersData.orders);
      }
    } catch (err) {
      console.error("Gagal memuat pesanan:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-surface pt-32 pb-24 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-on-surface">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            <p className="font-semibold text-sm">Memuat Tiket Pesanan Anda...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-28 pb-24 text-on-surface">
        <div className="max-w-[1100px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-outline-variant/20">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold mb-2">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>DAFTAR TIKET TRANSAKSI</span>
              </div>
              <h1 className="font-headline-md text-2xl font-bold text-on-surface">
                Pesanan Anda
              </h1>
              <p className="text-xs text-on-surface-variant mt-1">
                Pantau status verifikasi dan bukti pembayaran top-up game Anda secara langsung
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchUserOrders}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-bold text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-secondary" : ""}`} />
                <span>{refreshing ? "Memperbarui..." : "Perbarui Status"}</span>
              </button>

              <Link
                href="/#katalog-game"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed text-xs font-bold shadow hover:bg-secondary-fixed-dim transition-colors"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Top Up Lagi</span>
              </Link>
            </div>
          </div>

          {/* User Info Bar */}
          <div className="mb-6 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
            <div>
              Akun Pelanggan: <span className="font-bold text-on-surface">{user?.name}</span> ({user?.email})
            </div>
            <div className="text-[11px] font-mono text-secondary">
              Total {orders.length} Transaksi Tercatat
            </div>
          </div>

          {/* List Pesanan */}
          {orders.length === 0 ? (
            <div className="rounded-2xl bg-surface-container border border-outline-variant/30 p-12 text-center space-y-4 shadow-md">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-high text-outline flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-on-surface">Belum Ada Pesanan Top Up</h3>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                Anda belum memiliki riwayat pembelian top up game. Silakan pilih game favorit Anda di katalog dan lakukan pemesanan dengan QRIS instan.
              </p>
              <div className="pt-2">
                <Link
                  href="/#katalog-game"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed text-xs font-bold shadow"
                >
                  <span>Mulai Top Up Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord: any) => {
                const waMessage = encodeURIComponent(
                  `Halo Owner Pribumar Games, saya ingin menanyakan status pesanan tiket:\n` +
                    `• No. Tiket: ${ord.id}\n` +
                    `• Game: ${ord.game_name} (${ord.item_name})\n` +
                    `• User ID: ${ord.account_id}\n` +
                    `• Status: ${ord.status}`
                );
                const waUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${waMessage}`;

                return (
                  <div
                    key={ord.id}
                    className="rounded-2xl bg-surface-container border border-outline-variant/30 p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-secondary/30 transition-all"
                  >
                    {/* Sisi Kiri: Info Game & Tiket */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-secondary bg-surface-container-high px-2.5 py-1 rounded-lg border border-outline-variant/30">
                          #{ord.id}
                        </span>

                        {ord.status === "menunggu_konfirmasi" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container border border-primary/40">
                            <Clock className="w-3 h-3 text-secondary animate-pulse" />
                            <span>Menunggu Konfirmasi</span>
                          </span>
                        )}

                        {ord.status === "dikonfirmasi" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container border border-secondary">
                            <CheckCircle className="w-3 h-3 text-secondary" />
                            <span>Dikonfirmasi &amp; Sukses</span>
                          </span>
                        )}

                        {ord.status === "dibatalkan" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-error-container text-error border border-error/40">
                            <XCircle className="w-3 h-3" />
                            <span>Dibatalkan</span>
                          </span>
                        )}

                        <span className="text-[11px] text-on-surface-variant">
                          • {new Date(ord.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-base text-on-surface flex items-center gap-2">
                          <span>{ord.game_name}</span>
                          <span className="text-secondary">—</span>
                          <span>{ord.item_name}</span>
                        </div>
                        <div className="text-xs text-on-surface-variant mt-0.5 font-mono">
                          ID Akun: <span className="text-on-surface font-semibold">{ord.account_id}</span>
                          {ord.zone_id ? ` (Server: ${ord.zone_id})` : ""} • WA: {ord.whatsapp}
                        </div>
                      </div>

                      {/* Info Pesan Berdasarkan Status */}
                      {ord.status === "dikonfirmasi" && (
                        <div className="text-xs text-secondary bg-secondary-container/30 px-3 py-1.5 rounded-xl border border-secondary/30 inline-block">
                          Selamat, pembayaran Anda telah dikonfirmasi! Diamond/item telah sukses dikirim ke akun game Anda.
                        </div>
                      )}

                      {ord.status === "menunggu_konfirmasi" && (
                        <div className="text-xs text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded-xl border border-outline-variant/20 inline-block">
                          Menunggu verifikasi transfer QRIS dari admin. Klik tombol WhatsApp di kanan jika butuh proses cepat.
                        </div>
                      )}
                    </div>

                    {/* Sisi Kanan: Harga & Aksi */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-outline-variant/15">
                      <div className="text-left md:text-right">
                        <div className="text-[10px] text-on-surface-variant uppercase font-semibold">Total Tagihan</div>
                        <div className="font-display-hero text-lg font-extrabold text-secondary">
                          Rp {Number(ord.price).toLocaleString("id-ID")}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link
                          href={`/payment/${ord.id}`}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-variant text-xs font-bold text-on-surface border border-outline-variant/30 transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5 text-secondary" />
                          <span>Lembar QRIS</span>
                        </Link>

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed text-xs font-bold shadow hover:bg-secondary-fixed-dim transition-colors"
                          title="Hubungi Owner di WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>Chat WA</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

