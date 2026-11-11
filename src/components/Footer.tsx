import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  MessageSquare,
  Radio,
  Globe,
  Camera,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 mt-space-3xl">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop pt-space-3xl pb-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-desktop">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="relative w-8 h-8">
                <Image
                  src={siteConfig.logo}
                  alt={`${siteConfig.name} Logo`}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-on-surface-variant font-body-sm text-body-sm leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-space-sm pt-space-xs">
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Community WhatsApp"
                className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="#news"
                aria-label="Broadcast Updates"
                className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors"
              >
                <Radio className="w-4 h-4" />
              </a>
              <a
                href="#about"
                aria-label="Network"
                className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                aria-label="Instagram Gallery"
                className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-space-md">
            <div className="font-title-card text-title-card text-on-surface font-semibold">
              Navigasi Cepat
            </div>
            <ul className="space-y-space-sm font-body-sm text-body-sm">
              <li>
                <Link
                  href="#home"
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Tentang Usaha
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Katalog Layanan
                </Link>
              </li>
              <li>
                <Link
                  href="#news"
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Berita &amp; Promo
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Games */}
          <div className="lg:col-span-3 space-y-space-md">
            <div className="font-title-card text-title-card text-on-surface font-semibold">
              Kategori Game
            </div>
            <ul className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
              <li>Mobile Legends: Bang Bang</li>
              <li>Free Fire MAX</li>
              <li>PUBG Mobile</li>
              <li>Genshin Impact &amp; Honkai</li>
              <li>Valorant Points &amp; Steam Wallet</li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-3 space-y-space-md">
            <div className="font-title-card text-title-card text-on-surface font-semibold">
              Metode Pembayaran
            </div>
            <p className="text-on-surface-variant font-body-sm text-body-sm">
              Didukung pembayaran resmi terverifikasi se-Indonesia:
            </p>
            <div className="grid grid-cols-3 gap-space-xs pt-space-xs">
              {siteConfig.paymentMethods.map((method) => (
                <div
                  key={method}
                  className="h-9 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-center text-on-surface font-label-badge text-label-badge font-bold tracking-wider hover:border-primary/50 transition-colors"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-space-2xl pt-space-xl border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant font-body-sm text-body-sm">
          <p>© {siteConfig.foundedYear} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-space-lg flex-wrap justify-center">
            <span className="flex items-center gap-space-xs">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>Transaksi Aman &amp; Terenkripsi</span>
            </span>
            <span className="flex items-center gap-space-xs">
              <Zap className="w-4 h-4 text-secondary fill-current" />
              <span>Proses Otomatis Detik</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

