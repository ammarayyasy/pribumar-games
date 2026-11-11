import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Zap, ShieldCheck, Gamepad2, Star, Bolt, ChevronDown, ShoppingBag, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden pb-space-3xl pt-space-xl" id="home">
      {/* Ambient Glow Orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-gradient-to-r from-secondary-container/35 via-primary-container/25 to-secondary-fixed/20 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute top-1/3 -right-32 w-96 h-96 bg-primary/10 blur-[110px] rounded-full" />

      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 flex flex-col items-start gap-space-lg">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-high border border-outline-variant/40 shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="font-label-badge text-label-badge uppercase tracking-wider text-secondary-fixed-dim">
                PORTAL RESMI TOP UP GAME SE-JAGAT RAYA
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display-hero text-headline-lg-mobile md:text-display-hero text-on-surface font-extrabold tracking-tight">
              Top Up Game Favorit{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-secondary-fixed-dim bg-clip-text text-transparent">
                Lebih Cepat, Murah,
              </span>{" "}
              &amp; 100% Legal
            </h1>

            {/* Description */}
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
              {siteConfig.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
              <Link
                href="#katalog-game"
                className="inline-flex items-center justify-center gap-space-xs px-space-xl py-3.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-label-action text-label-action font-bold shadow-[0_0_24px_rgba(227,181,255,0.4)] hover:bg-secondary-fixed-dim transition-all transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>Mulai Top Up Sekarang</span>
                <Bolt className="w-5 h-5 text-on-secondary-fixed fill-current" />
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center justify-center gap-space-xs px-space-xl py-3.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-action text-label-action font-semibold shadow-md transition-all border border-outline-variant/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>Lihat Layanan Kami</span>
                <ChevronDown className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-md w-full">
              <div className="p-space-sm rounded-lg bg-surface-container border border-outline-variant/20 flex flex-col gap-0.5 shadow-sm">
                <span className="text-secondary font-bold font-title-card text-title-card flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-secondary fill-current" /> &lt; 10 Detik
                </span>
                <span className="text-on-surface-variant font-body-sm text-body-sm">
                  Proses Otomatis
                </span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container border border-outline-variant/20 flex flex-col gap-0.5 shadow-sm">
                <span className="text-secondary font-bold font-title-card text-title-card flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-secondary" /> 100% Legal
                </span>
                <span className="text-on-surface-variant font-body-sm text-body-sm">
                  Garansi Resmi
                </span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container border border-outline-variant/20 flex flex-col gap-0.5 shadow-sm">
                <span className="text-secondary font-bold font-title-card text-title-card flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-secondary" /> 50+ Game
                </span>
                <span className="text-on-surface-variant font-body-sm text-body-sm">
                  Katalog Populer
                </span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container border border-outline-variant/20 flex flex-col gap-0.5 shadow-sm">
                <span className="text-secondary font-bold font-title-card text-title-card flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-secondary fill-current" /> 4.9/5 Rating
                </span>
                <span className="text-on-surface-variant font-body-sm text-body-sm">
                  Ribuan Gamers
                </span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative mt-space-lg lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-surface-container border border-outline-variant/30 group">
              <div className="relative w-full h-[400px] md:h-[460px]">
                <Image
                  src="/images/hero-setup.svg"
                  alt="Pribumar Games Esports Setup"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent pointer-events-none" />

              {/* Live Counter Overlay Pill */}
              <div className="absolute bottom-space-lg left-space-lg right-space-lg p-space-md rounded-xl bg-surface-container-high/90 backdrop-blur-md border border-outline-variant/30 shadow-xl flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0 text-on-primary-container shadow-inner">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-price-numeral text-price-numeral text-on-surface font-bold">
                      250,000+
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Pesanan Sukses
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-space-sm py-1 rounded-md bg-secondary-container text-on-secondary-container font-label-badge text-label-badge font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>99.8% Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

