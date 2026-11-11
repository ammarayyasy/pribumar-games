import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allNews = await db.getNews();
    const published = allNews.filter((n) => n.status === "published");
    return NextResponse.json({ success: true, news: published });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
