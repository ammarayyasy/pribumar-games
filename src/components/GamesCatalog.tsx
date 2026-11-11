"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig, GameItem } from "@/config/site";
import { Search, Flame, ArrowRight, Gamepad2 } from "lucide-react";

export function GamesCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "all", label: "Semua Game" },
    { id: "mobile", label: "Mobile Games" },
    { id: "pc", label: "PC & Console" },
    { id: "voucher", label: "Voucher Digital" },
  ];

  const filteredGames = siteConfig.popularGames.filter((game: GameItem) => {
    const matchesCategory =
      selectedCategory === "all" || game.category === selectedCategory;
    const matchesSearch =
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.publisher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="w-full py-space-3xl relative" id="katalog-game">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
          <div>
            <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container border border-outline-variant/30 text-secondary mb-space-xs">
              <Flame className="w-4 h-4 fill-current text-secondary" />
              <span className="font-label-badge text-label-badge uppercase tracking-wider font-bold">
                KATALOG TOP UP POPULER
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold tracking-tight">
              Pilih Game Favorit Anda
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Pengisian instan otomatis 24 jam dengan harga termurah se-jagat raya.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-outline absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari game (MLBB, FF, dll)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-space-lg no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-label-action text-sm font-semibold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(142,30,162,0.4)] border border-primary/50"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Game Cards Grid */}
        {filteredGames.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-surface-container border border-outline-variant/20">
            <Gamepad2 className="w-12 h-12 text-outline mx-auto mb-3 opacity-60" />
            <div className="font-bold text-on-surface">Game tidak ditemukan</div>
            <div className="text-sm text-on-surface-variant mt-1">
              Coba gunakan kata kunci pencarian yang lain.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredGames.map((game: GameItem) => (
              <Link
                key={game.id}
                href={`/topup/${game.slug}`}
                className="group relative rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/25 hover:border-secondary/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* Artwork Thumbnail */}
                <div className="relative aspect-square w-full overflow-hidden bg-surface-container-high">
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-badge text-xs font-bold shadow-md">
                    {game.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-0.5">
                      {game.publisher}
                    </div>
                    <h3 className="font-title-card text-sm md:text-base text-on-surface font-bold leading-snug group-hover:text-primary transition-colors line-clamp-1">
                      {game.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between">
                    <span className="text-xs text-secondary font-bold">
                      Top Up Instan
                    </span>
                    <div className="w-7 h-7 rounded-full bg-surface-container-high group-hover:bg-secondary-fixed group-hover:text-on-secondary-fixed flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

