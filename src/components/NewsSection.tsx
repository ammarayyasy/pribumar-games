"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig, NewsItem } from "@/config/site";
import { Calendar, ArrowRight, BookOpen, Sparkles } from "lucide-react";

export function NewsSection() {
  const [newsData, setNewsData] = useState<any[]>(siteConfig.news);

  useEffect(() => {
    async function fetchLiveNews() {
      try {
        const res = await fetch("/api/news");
        const json = await res.json();
        if (json.success && Array.isArray(json.news) && json.news.length > 0) {
          // Transform db news structure to display format
          const formatted = json.news.map((item: any) => ({
            id: item.slug || item.id,
            title: item.title,
            excerpt: item.excerpt,
            category: "PROMO",
            date: new Date(item.created_at || Date.now()).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            thumbnail: item.thumbnail_path || "/images/news-promo.svg",
            author: "Pribumar Games",
          }));
          setNewsData(formatted);
        }
      } catch (err) {
        // fallback to siteConfig.news
      }
    }
    fetchLiveNews();
  }, []);

  const categoryBadgeColors: Record<string, string> = {
    PROMO: "bg-primary-container text-on-primary-container",
    KERJASAMA: "bg-secondary-container text-on-secondary-container",
    EDUKASI: "bg-tertiary-container text-on-tertiary-container",
  };

  return (
    <section className="w-full py-space-3xl bg-surface-container-low relative border-t border-b border-outline-variant/20" id="news">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-2xl">
          <div className="inline-flex items-center gap-1.5 font-label-badge text-label-badge text-primary font-bold uppercase tracking-widest px-space-md py-1 rounded-full bg-surface-container border border-outline-variant/30 mb-space-xs">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>BERITA &amp; UPDATE RESMI</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold tracking-tight">
            Kabar Terbaru Esport &amp; Promo Menarik
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
            Terhubung langsung dengan database. Dapatkan update promo diamond, event turnamen, dan tips transaksi aman.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
          {newsData.slice(0, 6).map((article: any) => (
            <article
              key={article.id}
              className="rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/25 flex flex-col justify-between shadow-md hover:shadow-xl hover:border-primary/40 transition-all duration-300 group hover:-translate-y-1"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative overflow-hidden h-52 bg-surface-container-high">
                  <Image
                    src={article.thumbnail || "/images/news-promo.svg"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-space-sm right-space-sm px-space-sm py-1 rounded-md font-label-badge text-label-badge font-bold uppercase tracking-wider shadow-md ${
                      categoryBadgeColors[article.category] || "bg-primary-container text-on-primary-container"
                    }`}
                  >
                    {article.category || "UPDATE"}
                  </span>
                </div>

                {/* Article Info */}
                <div className="p-space-lg">
                  <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm mb-space-xs">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span>{article.date}</span>
                    <span className="mx-1">•</span>
                    <span>{article.author}</span>
                  </div>
                  <h3 className="font-title-card text-title-card text-on-surface font-bold group-hover:text-primary transition-colors mb-space-xs leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="px-space-lg pb-space-lg pt-0">
                <Link
                  href={`/news/${article.id}`}
                  className="inline-flex items-center gap-1.5 font-label-action text-label-action text-secondary hover:text-secondary-fixed font-semibold transition-colors focus:outline-none focus-visible:underline"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-space-2xl">
          <Link
            href="#news"
            className="inline-flex items-center justify-center gap-space-xs px-space-xl py-3 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-action text-label-action font-semibold shadow-md transition-all border border-outline-variant/30 hover:border-secondary/40"
          >
            <BookOpen className="w-4 h-4 text-secondary" />
            <span>Lihat Semua Berita &amp; Panduan</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
