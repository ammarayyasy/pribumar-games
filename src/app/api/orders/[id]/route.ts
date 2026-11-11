import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Silakan login untuk melihat rincian tiket pesanan." },
        { status: 401 }
      );
    }

    const orderId = params.id;
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Kode tiket pesanan tidak valid." },
        { status: 400 }
      );
    }

    const order = await db.findOrderById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Tiket pesanan tidak ditemukan di database." },
        { status: 404 }
      );
    }

    // Hanya pembuat pesanan atau admin yang berhak melihat tiket ini
    if (order.user_id !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Tiket ini milik pengguna lain." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Get order by id error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memuat rincian tiket pesanan." },
      { status: 500 }
    );
  }
}

