import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function checkAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
  }

  const news = await db.getNews();
  return NextResponse.json({ success: true, news });
}

export async function POST(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, excerpt, content, thumbnail_path, status } = body;

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { success: false, error: "Judul, ringkasan, dan konten berita wajib diisi." },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newArticle = await db.createNews({
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      excerpt,
      content,
      thumbnail_path: thumbnail_path || "/images/news-promo.svg",
      status: status || "published",
      author_id: admin.id,
    });

    return NextResponse.json({ success: true, news: newArticle });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, title, excerpt, content, thumbnail_path, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID berita wajib diisi." }, { status: 400 });
    }

    const updates: any = {};
    if (title) updates.title = title;
    if (excerpt) updates.excerpt = excerpt;
    if (content) updates.content = content;
    if (thumbnail_path) updates.thumbnail_path = thumbnail_path;
    if (status) updates.status = status;

    await db.updateNews(id, updates);
    return NextResponse.json({ success: true, message: "Berita berhasil diupdate." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID berita wajib disertakan." }, { status: 400 });
    }

    await db.deleteNews(id);
    return NextResponse.json({ success: true, message: "Berita berhasil dihapus." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
