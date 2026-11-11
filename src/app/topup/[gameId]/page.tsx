"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { siteConfig, GameItem, DenominationItem, PaymentMethodItem } from "@/config/site";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  HelpCircle,
  CreditCard,
  QrCode,
  Smartphone,
  Phone,
  Check,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";

export default function TopUpPage() {
  const router = useRouter();
  const params = useParams();
  const gameSlug = params.gameId as string;
  const game = siteConfig.popularGames.find((g: GameItem) => g.slug === gameSlug);

  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [idChecked, setIdChecked] = useState(false);
  const [checkedNickname, setCheckedNickname] = useState("");
  const [selectedDenom, setSelectedDenom] = useState<DenominationItem | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodItem>(
    siteConfig.paymentMethodsList[0]
  );
  const [whatsapp, setWhatsapp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  if (!game) {
    return notFound();
  }

  const handleCheckId = () => {
    if (!userId.trim()) {
      alert("Silakan masukkan User ID terlebih dahulu.");
      return;
    }
    setIdChecked(true);
    setCheckedNickname(`ProGamer_${userId.slice(-4) || "888"}`);
  };

  const calculateTotal = () => {
    if (!selectedDenom) return 0;
    return selectedDenom.price + (selectedPayment ? selectedPayment.fee : 0);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      alert("Mohon masukkan User ID akun game Anda.");
      return;
    }
    if (game.requiresZoneId && !zoneId.trim()) {
      alert("Mohon masukkan Zone ID / Server akun game Anda.");
      return;
    }
    if (!selectedDenom) {
      alert("Mohon pilih nominal top up (berapa banyak yang ingin dibeli).");
      return;
    }
    if (!whatsapp.trim()) {
      alert("Mohon masukkan nomor WhatsApp untuk pengiriman invoice.");
      return;
    }
    setOrderError("");
    setIsModalOpen(true);
  };

  const handleConfirmOrder = async () => {
    setSubmittingOrder(true);
    setOrderError("");

    try {
      // 1. Cek sesi login terlebih dahulu (wajib sesuai aturan pemesanan)
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.push(`/login?callbackUrl=/topup/${gameSlug}`);
        return;
      }

      // 2. Buat tiket pesanan ke server & database
      const orderPayload = {
        game_id: game.id,
        game_name: game.name,
        item_id: selectedDenom?.id,
        item_name: selectedDenom?.name,
        price: calculateTotal(),
        account_id: userId,
        zone_id: zoneId,
        payment_method: selectedPayment.name,
        whatsapp: whatsapp,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setIsModalOpen(false);
        router.push(`/payment/${data.order.id}`);
      } else {
        setOrderError(data.error || "Gagal membuat pesanan. Silakan coba lagi.");
      }
    } catch (err: any) {
      setOrderError("Terjadi gangguan jaringan saat memproses pesanan.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="w-full pt-28 pb-24 bg-surface min-h-screen">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          {/* Back to Catalog Link */}
          <Link
            href="/#katalog-game"
            className="inline-flex items-center gap-2 text-secondary hover:text-secondary-fixed text-sm font-semibold transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Katalog Game</span>
          </Link>

          {/* Grid Layout: Left Content, Right Sticky Checkout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (Forms & Selection) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Game Header Banner */}
              <div className="rounded-2xl bg-surface-container border border-outline-variant/30 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-outline-variant/40">
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-badge text-xs font-bold mb-2">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{game.badge}</span>
                  </div>
                  <h1 className="font-headline-md text-headline-md text-on-surface font-extrabold">
                    {game.name}
                  </h1>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Publisher: <span className="text-on-surface font-semibold">{game.publisher}</span> • Pengiriman Otomatis 24 Jam
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1 text-secondary font-medium">
                      <ShieldCheck className="w-4 h-4" /> 100% Legal &amp; Aman
                    </span>
                    <span className="flex items-center gap-1 text-secondary font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Garansi Anti Minus
                    </span>
                  </div>
                </div>
              </div>

              {/* STEP 1: Masukkan Data Akun */}
              <div className="rounded-2xl bg-surface-container border border-outline-variant/30 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h2 className="font-title-card text-lg text-on-surface font-bold">
                    Masukkan Data Akun
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="userIdInput"
                      className="block text-xs font-semibold text-on-surface-variant mb-1.5"
                    >
                      User ID Game <span className="text-secondary">*</span>
                    </label>
                    <input
                      id="userIdInput"
                      type="text"
                      required
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                        setIdChecked(false);
                      }}
                      placeholder="Contoh: 12345678"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface placeholder:text-outline font-body-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                    />
                  </div>

                  {game.requiresZoneId && (
                    <div>
                      <label
                        htmlFor="zoneIdInput"
                        className="block text-xs font-semibold text-on-surface-variant mb-1.5"
                      >
                        {game.zoneIdLabel || "Zone ID"} <span className="text-secondary">*</span>
                      </label>
                      <input
                        id="zoneIdInput"
                        type="text"
                        required
                        value={zoneId}
                        onChange={(e) => {
                          setZoneId(e.target.value);
                          setIdChecked(false);
                        }}
                        placeholder="Contoh: 2045"
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface placeholder:text-outline font-body-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                      />
                    </div>
                  )}
                </div>

                {/* Check ID Button & Feedback */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/15">
                  <button
                    type="button"
                    onClick={handleCheckId}
                    className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-variant text-secondary text-xs font-bold transition-all border border-secondary/40 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verifikasi / Cek Nickname</span>
                  </button>

                  {idChecked && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/15 text-secondary border border-secondary/40 text-xs font-bold animate-in fade-in">
                      <Check className="w-3.5 h-3.5" />
                      <span>Akun Terverifikasi: {checkedNickname}</span>
                    </div>
                  )}

                  <div className="text-xs text-on-surface-variant flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Petunjuk: Cek profil dalam game Anda</span>
                  </div>
                </div>
              </div>

              {/* STEP 2: Pilih Berapa Banyak yang Dibeli (Denominasi) */}
              <div className="rounded-2xl bg-surface-container border border-outline-variant/30 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h2 className="font-title-card text-lg text-on-surface font-bold">
                        Pilih Nominal Pembelian
                      </h2>
                      <p className="text-xs text-on-surface-variant">
                        Tentukan jumlah {game.currencyName} yang ingin Anda beli
                      </p>
                    </div>
                  </div>
                  {selectedDenom && (
                    <span className="hidden sm:inline-block text-xs font-bold text-secondary bg-surface-container-high px-3 py-1 rounded-full border border-secondary/30">
                      Dipilih: {selectedDenom.name}
                    </span>
                  )}
                </div>

                {/* Denomination Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {game.denominations.map((denom: DenominationItem) => {
                    const isSelected = selectedDenom?.id === denom.id;

                    return (
                      <button
                        key={denom.id}
                        type="button"
                        onClick={() => setSelectedDenom(denom)}
                        className={`relative p-3.5 rounded-xl text-left transition-all duration-200 flex flex-col justify-between focus:outline-none ${
                          isSelected
                            ? "bg-primary-container/20 border-2 border-secondary shadow-[0_0_16px_rgba(227,181,255,0.3)] transform -translate-y-0.5"
                            : "bg-surface-container-high hover:bg-surface-variant border border-outline-variant/30 hover:border-outline"
                        }`}
                      >
                        {/* Top badges */}
                        {(denom.bonus || denom.discount || denom.isPopular) && (
                          <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed shadow">
                            {denom.discount || denom.bonus || "Populer"}
                          </span>
                        )}

                        <div>
                          <div className="text-xs text-on-surface-variant font-medium">
                            {game.currencyName}
                          </div>
                          <div className="font-headline-sm text-sm font-bold text-on-surface mt-0.5 leading-snug">
                            {denom.name}
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-outline-variant/15 flex items-center justify-between">
                          <span className="font-price-numeral text-sm font-bold text-secondary">
                            Rp {denom.price.toLocaleString("id-ID")}
                          </span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-secondary text-surface flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 3: Pilih Metode Pembayaran */}
              <div className="rounded-2xl bg-surface-container border border-outline-variant/30 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h2 className="font-title-card text-lg text-on-surface font-bold">
                      Pilih Metode Pembayaran
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Dukungan QRIS instan bebas biaya &amp; Virtual Account 24 jam
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {siteConfig.paymentMethodsList.map((pm: PaymentMethodItem) => {
                    const isSelected = selectedPayment.id === pm.id;

                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setSelectedPayment(pm)}
                        className={`p-3.5 rounded-xl text-left transition-all duration-200 flex items-start justify-between gap-3 focus:outline-none ${
                          isSelected
                            ? "bg-primary-container/20 border-2 border-secondary shadow-[0_0_16px_rgba(227,181,255,0.3)]"
                            : "bg-surface-container-high hover:bg-surface-variant border border-outline-variant/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30 text-secondary">
                            {pm.category === "qris" ? (
                              <QrCode className="w-5 h-5" />
                            ) : pm.category === "ewallet" ? (
                              <Smartphone className="w-5 h-5" />
                            ) : (
                              <CreditCard className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-title-card text-sm font-bold text-on-surface">
                              {pm.name}
                            </div>
                            <div className="text-[11px] text-on-surface-variant mt-0.5">
                              {pm.desc}
                            </div>
                            <div className="text-xs font-semibold text-secondary mt-1">
                              Biaya: {pm.fee === 0 ? "Gratis (Rp 0)" : `Rp ${pm.fee.toLocaleString("id-ID")}`}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full bg-secondary text-surface flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant border border-outline-variant/30 font-bold">
                              {pm.badge}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 4: Nomor WhatsApp */}
              <div className="rounded-2xl bg-surface-container border border-outline-variant/30 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h2 className="font-title-card text-lg text-on-surface font-bold">
                      Nomor WhatsApp Pembeli
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Bukti transaksi &amp; notifikasi pengiriman instan akan dikirim ke nomor ini
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-outline absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface placeholder:text-outline font-body-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Summary & Buy Trigger */}
            <div className="lg:col-span-4 sticky top-28 space-y-4">
              <div className="rounded-2xl bg-surface-container border border-outline-variant/30 p-6 shadow-xl">
                <h3 className="font-title-card text-base text-on-surface font-bold mb-4 pb-3 border-b border-outline-variant/20">
                  Ringkasan Pesanan Anda
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Game:</span>
                    <span className="font-bold text-on-surface">{game.name}</span>
                  </div>

                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>User ID:</span>
                    <span className="font-mono font-bold text-secondary">
                      {userId ? `${userId}${zoneId ? ` (${zoneId})` : ""}` : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Item Nominal:</span>
                    <span className="font-bold text-on-surface">
                      {selectedDenom ? selectedDenom.name : "Belum dipilih"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Metode Bayar:</span>
                    <span className="font-bold text-on-surface">
                      {selectedPayment ? selectedPayment.name : "-"}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 flex justify-between items-baseline">
                    <span className="font-bold text-on-surface">Total Tagihan:</span>
                    <span className="font-display-hero text-xl font-extrabold text-secondary">
                      Rp {calculateTotal().toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={!selectedDenom}
                  className={`w-full mt-6 py-3.5 rounded-xl font-label-action text-label-action font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                    selectedDenom
                      ? "bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim shadow-[0_0_20px_rgba(227,181,255,0.4)] cursor-pointer"
                      : "bg-surface-container-high text-outline cursor-not-allowed border border-outline-variant/30"
                  }`}
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>Beli Sekarang</span>
                </button>

                <p className="text-[11px] text-center text-on-surface-variant mt-3 leading-relaxed">
                  Dengan mengklik Beli Sekarang, Anda menyetujui Syarat &amp; Ketentuan transaksi legal Pribumar Games.
                </p>
              </div>

              {/* Customer Guarantee Card */}
              <div className="rounded-2xl bg-surface-container-low border border-outline-variant/20 p-4 text-xs text-on-surface-variant space-y-2">
                <div className="font-bold text-on-surface flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-secondary" />
                  Jaminan Transaksi Pribumar Games
                </div>
                <div>• Pengiriman diamond instan dalam hitungan detik.</div>
                <div>• Pelayanan ramah langsung dari owner.</div>
                <div>• Terintegrasi ke Google Spreadsheet di Step 2 &amp; QRIS resmi di Step 3.</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* POPUP KONFIRMASI CHECKOUT & ORDER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-surface-container border border-secondary/40 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="w-6 h-6 text-secondary" />
                <h3 className="text-lg font-bold text-on-surface">
                  Konfirmasi Pembelian &amp; Buat Tiket
                </h3>
              </div>

              {orderError && (
                <div className="p-3 mb-4 rounded-xl bg-error-container/40 border border-error text-error text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{orderError}</span>
                </div>
              )}

              <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/30 space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Game Tujuan:</span>
                  <span className="font-bold text-on-surface">{game.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">User ID Game:</span>
                  <span className="font-mono font-bold text-secondary">
                    {userId} {zoneId ? `(${zoneId})` : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Item Pembelian:</span>
                  <span className="font-bold text-on-surface">{selectedDenom?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Metode Pembayaran:</span>
                  <span className="font-bold text-on-surface">{selectedPayment.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Nomor WhatsApp:</span>
                  <span className="font-mono text-on-surface">{whatsapp}</span>
                </div>
                <div className="pt-2 border-t border-outline-variant/20 flex justify-between font-bold text-base">
                  <span>Total Tagihan:</span>
                  <span className="text-secondary">Rp {calculateTotal().toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="p-3 mb-6 rounded-xl bg-secondary-container/20 border border-secondary/30 text-xs text-on-surface-variant flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <div>
                  Setelah konfirmasi, tiket pesanan akan dibuat otomatis dan Anda akan diarahkan ke lembar scan <strong>QRIS resmi GoPay Merchant</strong> untuk pembayaran instan.
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={submittingOrder}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-semibold text-sm disabled:opacity-60"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={submittingOrder}
                  onClick={handleConfirmOrder}
                  className="flex-1 py-2.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-bold text-sm shadow-[0_0_16px_rgba(227,181,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submittingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Membuat Tiket...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Lanjut ke QRIS</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

