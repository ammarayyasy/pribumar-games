"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  QrCode,
  Copy,
  Check,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  ShieldCheck,
  MessageCircle,
  ArrowLeft,
  Loader2,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.status === 401) {
        router.push(`/login?callbackUrl=/payment/${orderId}`);
        return;
      }
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        setError("");
      } else {
        setError(data.error || "Tiket pesanan tidak ditemukan.");
      }
    } catch (err: any) {
      setError("Gagal memuat detail pesanan.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleCopyTicket = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-surface pt-32 pb-24 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-on-surface">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            <p className="font-semibold text-sm">Menyiapkan Lembar Pembayaran QRIS...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-surface pt-32 pb-24">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="p-6 rounded-2xl bg-surface-container border border-error/30 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
                <XCircle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-on-surface">Terjadi Kendala</h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {error || "Tiket pesanan tidak ditemukan."}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/#katalog-game"
                  className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-variant text-xs font-bold text-on-surface"
                >
                  Ke Katalog Game
                </Link>
                <Link
                  href="/orders"
                  className="px-4 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed text-xs font-bold shadow"
                >
                  Daftar Pesanan Anda
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Pesan WhatsApp otomatis untuk konfirmasi
  const waMessage = encodeURIComponent(
    `Halo Owner Pribumar Games, saya ingin mengonfirmasi pembayaran top-up:\n\n` +
      `• No. Tiket: ${order.id}\n` +
      `• Game: ${order.game_name}\n` +
      `• Item: ${order.item_name}\n` +
      `• User ID Game: ${order.account_id} ${order.zone_id ? `(${order.zone_id})` : ""}\n` +
      `• Total Tagihan: Rp ${Number(order.price).toLocaleString("id-ID")}\n\n` +
      `Berikut saya lampirkan bukti transfer pembayarannya. Mohon segera diproses ya!`
  );
  const waUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${waMessage}`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-28 pb-24 text-on-surface">
        <div className="max-w-[1100px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          {/* Navigasi Balik */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary-fixed text-xs font-bold transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Kembali ke Pesanan Anda</span>
            </Link>

            <button
              onClick={fetchOrder}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-secondary" : ""}`} />
              <span>{refreshing ? "Memperbarui..." : "Perbarui Status"}</span>
            </button>
          </div>

          {/* Banner Status Transaksi */}
          {order.status === "menunggu_konfirmasi" && (
            <div className="mb-6 p-4 rounded-2xl bg-primary-container/20 border border-primary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-secondary animate-pulse" />
                </div>
                <div>
                  <div className="font-bold text-sm text-on-surface flex items-center gap-2">
                    <span>Menunggu Pembayaran &amp; Konfirmasi Admin</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-fixed/20 text-secondary border border-secondary/40 uppercase font-mono font-bold">
                      Menunggu
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Silakan scan kode QRIS resmi di bawah ini sesuai total tagihan, lalu konfirmasi via WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          )}

          {order.status === "dikonfirmasi" && (
            <div className="mb-6 p-4 rounded-2xl bg-secondary-container/30 border border-secondary text-secondary flex items-start sm:items-center gap-3 shadow-lg">
              <CheckCircle className="w-6 h-6 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <div className="font-bold text-sm text-on-surface">
                  Pembayaran Berhasil Dikonfirmasi!
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Selamat! Tiket pesanan Anda telah diverifikasi oleh owner. Diamond / voucher game Anda telah diproses ke akun game tujuan.
                </p>
              </div>
            </div>
          )}

          {order.status === "dibatalkan" && (
            <div className="mb-6 p-4 rounded-2xl bg-error-container/30 border border-error text-error flex items-start sm:items-center gap-3 shadow-lg">
              <XCircle className="w-6 h-6 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <div className="font-bold text-sm text-on-surface">Pesanan Dibatalkan</div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Pesanan ini telah dibatalkan atau ditolak. Jika merasa ini kekeliruan, silakan hubungi owner via WhatsApp.
                </p>
              </div>
            </div>
          )}

          {/* Grid Dua Kolom: QRIS & Detail Tiket */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Kolom Kiri: Barcode QRIS & Panduan (7 Kolom) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="rounded-2xl bg-surface-container border border-outline-variant/30 p-6 shadow-xl flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/30 text-xs font-bold text-secondary mb-3">
                  <QrCode className="w-4 h-4" />
                  <span>PEMBAYARAN QRIS NASIONAL (GOPAY MERCHANT)</span>
                </div>

                <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                  Scan QRIS untuk Menyelesaikan Pembayaran
                </h2>
                <p className="text-xs text-on-surface-variant mt-1 max-w-md">
                  Dukung pembayaran instan bebas biaya admin dari seluruh bank dan dompet digital Indonesia.
                </p>

                {/* Tampilan Gambar QRIS Resmi */}
                <div className="mt-5 relative w-full max-w-[340px] aspect-[3/4.2] rounded-2xl overflow-hidden border-2 border-secondary/40 shadow-2xl bg-white">
                  <Image
                    src={siteConfig.qris.image}
                    alt="QRIS Pribumar Games - Mohammad Ammar Ayyasy"
                    fill
                    className="object-contain p-2"
                    priority
                  />
                </div>

                {/* Merchant Information */}
                <div className="mt-4 p-3 rounded-xl bg-surface-container-high border border-outline-variant/20 w-full max-w-[340px] text-xs text-left space-y-1">
                  <div className="text-[11px] text-on-surface-variant uppercase font-semibold">
                    Nama Merchant Resmi:
                  </div>
                  <div className="font-bold text-on-surface text-sm">
                    {siteConfig.qris.merchantName}
                  </div>
                  <div className="text-[11px] text-outline font-mono">
                    NMID: {siteConfig.qris.nmid}
                  </div>
                </div>

                {/* Tombol Simpan / Unduh QRIS */}
                <a
                  href={siteConfig.qris.image}
                  download="QRIS-Pribumar-Games.jpg"
                  className="mt-3 text-xs text-secondary hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Unduh Gambar QRIS / Buka Ukuran Penuh</span>
                </a>
              </div>

              {/* Panduan Pembayaran 6 Langkah */}
              <div className="rounded-2xl bg-surface-container border border-outline-variant/30 p-6 shadow-lg">
                <h3 className="font-title-card text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-secondary" />
                  <span>Cara Membayar Lewat Aplikasi Apa Saja</span>
                </h3>

                <ol className="space-y-2.5 text-xs text-on-surface-variant list-decimal pl-4 leading-relaxed">
                  {siteConfig.qris.instructions.map((step: string, idx: number) => (
                    <li key={idx}>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Kolom Kanan: Rincian Tiket & Tombol Aksi (5 Kolom) */}
            <div className="lg:col-span-5 sticky top-28 space-y-4">
              <div className="rounded-2xl bg-surface-container border border-outline-variant/30 p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-4">
                  <div>
                    <div className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                      Kode Tiket Pesanan
                    </div>
                    <div className="font-mono text-lg font-bold text-secondary flex items-center gap-2 mt-0.5">
                      <span>{order.id}</span>
                      <button
                        onClick={handleCopyTicket}
                        className="p-1 rounded-md bg-surface-container-high hover:bg-surface-variant text-on-surface-variant hover:text-on-surface transition-colors"
                        title="Salin Kode Tiket"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-secondary" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {copied && (
                    <span className="text-[10px] font-bold text-secondary bg-secondary-container px-2 py-0.5 rounded-full">
                      Tersalin!
                    </span>
                  )}
                </div>

                {/* Detail Pesanan */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Game Tujuan:</span>
                    <span className="font-bold text-on-surface text-sm">{order.game_name}</span>
                  </div>

                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Item Nominal:</span>
                    <span className="font-bold text-on-surface text-sm">{order.item_name}</span>
                  </div>

                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>User ID Game:</span>
                    <span className="font-mono font-bold text-secondary text-sm">
                      {order.account_id} {order.zone_id ? `(${order.zone_id})` : ""}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Nomor WhatsApp:</span>
                    <span className="font-mono text-on-surface">{order.whatsapp}</span>
                  </div>

                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Waktu Pesan:</span>
                    <span>{new Date(order.created_at).toLocaleString("id-ID")}</span>
                  </div>

                  {/* Total Tagihan */}
                  <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-baseline">
                    <span className="font-bold text-sm text-on-surface">Total Tagihan:</span>
                    <span className="font-display-hero text-2xl font-extrabold text-secondary">
                      Rp {Number(order.price).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Tombol Aksi Utama: WhatsApp Owner */}
                <div className="mt-6 space-y-3">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-xs shadow-lg hover:bg-secondary-fixed-dim transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(227,181,255,0.4)]"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Konfirmasi Pembayaran via WhatsApp</span>
                  </a>

                  <Link
                    href="/orders"
                    className="w-full py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-outline-variant/30"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-secondary" />
                    <span>Lihat di Halaman Pesanan Anda</span>
                  </Link>
                </div>

                <div className="mt-4 pt-3 border-t border-outline-variant/15 text-[11px] text-center text-on-surface-variant leading-relaxed">
                  Setelah mengirim bukti bayar ke WhatsApp owner, status pesanan akan otomatis diverifikasi dalam 1-5 menit.
                </div>
              </div>

              {/* Jaminan Layanan */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface-variant space-y-1.5">
                <div className="font-bold text-on-surface flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-secondary" />
                  <span>Garansi Transaksi Pribumar Games</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Platform top up terpercaya se-Jonggol Raya &amp; seluruh Indonesia. Pelayanan ramah ditangani langsung oleh owner sejak 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

