import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Rocket, BadgePercent, Headset, MapPin } from "lucide-react";

export function About() {
  const pillarIcons = [Rocket, BadgePercent, Headset];

  return (
    <section className="w-full py-space-3xl bg-surface-container-low relative border-t border-b border-outline-variant/20" id="about">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-2xl">
          <span className="font-label-badge text-label-badge text-primary font-bold uppercase tracking-widest px-space-md py-1 rounded-full bg-surface-container border border-outline-variant/30 mb-space-xs">
            TENTANG PRIBUMAR GAMES
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold tracking-tight">
            Dedikasi Kami untuk Seluruh Gamers Indonesia
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
            {siteConfig.description} {siteConfig.ownerNote}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
          {/* Left: Operational & Identity Visual */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-xl bg-surface-container border border-outline-variant/30 relative">
              <div className="relative w-full h-[360px] md:h-[400px]">
                <Image
                  src="/images/team-operational.svg"
                  alt="Operasional Pribumar Games di Jonggol Raya"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Sub-badge Location Card */}
            <div className="mt-space-sm p-space-md rounded-xl bg-surface-container border border-outline-variant/30 shadow-md flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-secondary" />
              </div>
              <div className="min-w-0">
                <div className="font-title-card text-title-card text-on-surface font-semibold truncate">
                  Pusat Operasional Jonggol Raya
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  {siteConfig.contact.address}
                </div>
              </div>
            </div>
          </div>

          {/* Right: 3 Pillars Cards */}
          <div className="lg:col-span-7 flex flex-col gap-space-md order-1 lg:order-2">
            {siteConfig.pillars.map((pillar, idx) => {
              const IconComponent = pillarIcons[idx] || Rocket;
              return (
                <div
                  key={pillar.title}
                  className="p-space-lg rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/25 transition-all duration-300 shadow-md flex gap-space-md items-start group hover:border-primary/40 hover:-translate-y-0.5"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${pillar.colorClass} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-title-card text-title-card text-on-surface font-bold mb-1 group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

