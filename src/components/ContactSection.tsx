"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    category: "topup",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", contact: "", category: "topup", message: "" });
    }, 4000);
  };

  return (
    <section className="w-full py-space-3xl relative" id="contact">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-2xl">
          <span className="font-label-badge text-label-badge text-secondary font-bold uppercase tracking-widest px-space-md py-1 rounded-full bg-surface-container border border-outline-variant/30 mb-space-xs">
            HUBUNGI KAMI
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold tracking-tight">
            Konsultasi &amp; Layanan Bantuan Pelanggan
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
            Punya pertanyaan seputar status pesanan, integrasi reseller, atau kendala transaksi? Owner dan tim siap mendampingi Anda 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
          {/* Left: Contact Info + Form */}
          <div className="lg:col-span-6 flex flex-col gap-space-lg">
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 shadow-sm flex items-start gap-space-sm">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-1" />
                <div className="min-w-0">
                  <div className="font-title-card text-title-card text-on-surface font-semibold text-sm">
                    Alamat Kantor
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {siteConfig.contact.address}
                  </p>
                </div>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 shadow-sm flex items-start gap-space-sm">
                <Phone className="w-5 h-5 text-secondary shrink-0 mt-1" />
                <div className="min-w-0">
                  <div className="font-title-card text-title-card text-on-surface font-semibold text-sm">
                    Telepon / WhatsApp
                  </div>
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body-sm text-body-sm text-on-surface hover:text-secondary font-medium transition-colors"
                  >
                    {siteConfig.contact.phone}
                  </a>
                  <div>
                    <span className="font-label-badge text-label-badge text-secondary font-bold">
                      Owner Fast Response
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 shadow-sm flex items-start gap-space-sm">
                <Mail className="w-5 h-5 text-secondary shrink-0 mt-1" />
                <div className="min-w-0">
                  <div className="font-title-card text-title-card text-on-surface font-semibold text-sm">
                    Email Resmi
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {siteConfig.contact.emailSupport}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {siteConfig.contact.emailPartnership}
                  </p>
                </div>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 shadow-sm flex items-start gap-space-sm">
                <Clock className="w-5 h-5 text-secondary shrink-0 mt-1" />
                <div className="min-w-0">
                  <div className="font-title-card text-title-card text-on-surface font-semibold text-sm">
                    Jam Operasional
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Transaksi: Otomatis 24 Jam
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    CS Live: 08.00 - 24.00 WIB
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="p-space-lg rounded-2xl bg-surface-container border border-outline-variant/25 shadow-lg">
              <h3 className="font-title-card text-title-card text-on-surface font-bold mb-space-sm">
                Kirim Pesan Langsung ke Owner
              </h3>

              {formSubmitted ? (
                <div className="p-space-md rounded-xl bg-primary-container/30 border border-primary/50 text-on-surface flex items-center gap-space-sm animate-in fade-in duration-300">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <div className="font-bold text-sm">Pesan Berhasil Terkirim!</div>
                    <div className="text-xs text-on-surface-variant">
                      Terima kasih! Tim Pribumar Games akan segera menghubungi Anda melalui WhatsApp/Email.
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-space-sm">
                  <div>
                    <label
                      htmlFor="contactName"
                      className="block font-label-action text-label-action text-on-surface-variant mb-1 text-sm font-medium"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="contactName"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Ryan Pratama"
                      className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-high text-on-surface placeholder:text-outline border border-outline-variant/30 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <div>
                      <label
                        htmlFor="contactIdentifier"
                        className="block font-label-action text-label-action text-on-surface-variant mb-1 text-sm font-medium"
                      >
                        Email / WhatsApp
                      </label>
                      <input
                        id="contactIdentifier"
                        type="text"
                        required
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        placeholder="0812xxxx atau email@domain.com"
                        className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-high text-on-surface placeholder:text-outline border border-outline-variant/30 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contactCategory"
                        className="block font-label-action text-label-action text-on-surface-variant mb-1 text-sm font-medium"
                      >
                        Kategori Kendala
                      </label>
                      <select
                        id="contactCategory"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/30 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                      >
                        <option value="topup">Top Up &amp; Voucher Game</option>
                        <option value="reseller">Kemitraan Reseller / API</option>
                        <option value="payment">Konfirmasi Pembayaran QRIS</option>
                        <option value="other">Pertanyaan Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contactMessage"
                      className="block font-label-action text-label-action text-on-surface-variant mb-1 text-sm font-medium"
                    >
                      Pesan Anda
                    </label>
                    <textarea
                      id="contactMessage"
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Jelaskan kebutuhan atau sertakan Nomor Invoice transaksi..."
                      className="w-full px-space-md py-2.5 rounded-lg bg-surface-container-high text-on-surface placeholder:text-outline border border-outline-variant/30 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary font-label-action text-label-action font-bold transition-all shadow-md flex items-center justify-center gap-space-xs hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span>Kirim Pesan</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Google Maps Embed Card */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/25 shadow-xl">
            <div className="relative w-full h-80 lg:h-full min-h-[350px]">
              <iframe
                title="Peta Lokasi Kantor Pribumar Games Jonggol"
                src={siteConfig.contact.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter contrast-125 brightness-90 grayscale-[20%]"
              />

              {/* Pin Badge Overlay */}
              <div className="absolute top-space-md left-space-md p-space-sm px-space-md rounded-xl bg-surface-container-high/90 backdrop-blur-md border border-outline-variant/30 shadow-xl flex items-center gap-space-sm max-w-xs">
                <div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-title-card text-title-card text-on-surface font-bold text-sm truncate">
                    {siteConfig.name} HQ
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant text-xs truncate">
                    SMK IDN Boarding School, Jonggol
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Maps Action Bar */}
            <div className="p-space-lg bg-surface-container-high border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-space-md">
              <div>
                <div className="font-title-card text-title-card text-on-surface font-semibold text-sm">
                  Akses Lokasi &amp; Titik Temu
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  Area Jonggol Raya, Bogor - Mudah dijangkau via navigasi online
                </div>
              </div>
              <a
                href={siteConfig.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-space-xs px-space-lg py-2.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-label-action text-label-action font-semibold shadow-md hover:bg-secondary-fixed-dim transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

