import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Tidak terautentikasi atau sesi telah berakhir." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error("Auth me API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memverifikasi sesi." },
      { status: 500 }
    );
  }
}

