import Link from "next/link";
import { siteConfig, ServiceItem } from "@/config/site";
import {
  Smartphone,
  Gamepad,
  Ticket,
  Layers,
  Trophy,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Smartphone,
  Gamepad,
  Ticket,
  Layers,
  Trophy,
  Sparkles,
};

export function Services() {
  return (
    <section className="w-full py-space-3xl relative" id="services">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-2xl">
          <span className="font-label-badge text-label-badge text-secondary font-bold uppercase tracking-widest px-space-md py-1 rounded-full bg-surface-container border border-outline-variant/30 mb-space-xs">
            LAYANAN KAMI
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold tracking-tight">
            Solusi Lengkap Kebutuhan Voucher &amp; Top Up Game
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
            Pilih kategori transaksi yang Anda butuhkan dengan jaminan proses otomatis instan dan pembayaran termudah via QRIS serta E-Wallet.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-desktop">
          {siteConfig.services.map((item: ServiceItem) => {
            const IconComp = iconMap[item.icon] || Smartphone;

            return (
              <div
                key={item.id}
                className="p-space-lg rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/25 hover:border-secondary/50 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center mb-space-md group-hover:scale-110 group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-all shadow-md">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-title-card text-title-card text-on-surface font-bold mb-space-xs group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-space-lg pt-space-md border-t border-outline-variant/15 flex items-center justify-between">
                  <span className="font-label-badge text-label-badge text-secondary font-bold tracking-wider">
                    {item.badge}
                  </span>
                  <Link
                    href={`#contact`}
                    className="inline-flex items-center gap-1 text-on-surface-variant group-hover:text-primary transition-colors text-sm font-semibold focus:outline-none focus-visible:underline"
                  >
                    <span>Pesan</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

