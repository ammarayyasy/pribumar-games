import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

interface NewsDetailPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const newsList = await db.getNews();
  let article = newsList.find(
    (n) => n.id === params.id || n.slug === params.id
  );

  // Fallback to static config if not found in db
  if (!article) {
    const staticItem = siteConfig.news.find((n) => n.id === params.id);
    if (staticItem) {
      article = {
        id: staticItem.id,
        title: staticItem.title,
        slug: staticItem.id,
        excerpt: staticItem.excerpt,
        content: staticItem.content,
        thumbnail_path: staticItem.thumbnail,
        status: "published",
        author_id: "default",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  }

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="w-full pt-28 pb-20 bg-surface flex-1">
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          {/* Back link */}
          <Link
            href="/#news"
            className="inline-flex items-center gap-2 text-secondary hover:text-secondary-fixed transition-colors font-medium mb-8 text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Halaman Berita</span>
          </Link>

          {/* Article Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-md bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                BERITA RESMI
              </span>
              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(article.created_at).toLocaleDateString("id-ID")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                <User className="w-3.5 h-3.5" />
                <span>Pribumar Games</span>
              </div>
            </div>

            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Featured Thumbnail */}
          <div className="relative w-full h-[320px] md:h-[450px] rounded-2xl overflow-hidden mb-8 border border-outline-variant/30 shadow-2xl bg-surface-container">
            <Image
              src={article.thumbnail_path || "/images/news-promo.svg"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Body */}
          <div className="prose prose-invert max-w-none text-on-surface-variant font-body-lg text-body-lg leading-relaxed space-y-4">
            <p className="font-medium text-on-surface">
              {article.excerpt}
            </p>
            <div className="whitespace-pre-line">
              {article.content}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 p-6 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-on-surface">Punya Pertanyaan Seputar Promo Ini?</div>
              <div className="text-sm text-on-surface-variant">Hubungi layanan bantuan pelanggan Pribumar Games langsung via WhatsApp.</div>
            </div>
            <Link
              href="/#contact"
              className="px-6 py-2.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-bold text-sm shadow-md hover:bg-secondary-fixed-dim transition-all"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
