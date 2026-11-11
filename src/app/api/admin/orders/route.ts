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
    return NextResponse.json(
      { success: false, error: "Akses ditolak. Khusus admin." },
      { status: 403 }
    );
  }

  try {
    const orders = await db.getOrders();
    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error("Admin get orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memuat seluruh pesanan." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Akses ditolak. Khusus admin." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID tiket dan status pesanan wajib diisi." },
        { status: 400 }
      );
    }

    const validStatuses = ["menunggu_konfirmasi", "dikonfirmasi", "dibatalkan"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status pesanan tidak valid." },
        { status: 400 }
      );
    }

    const updates: any = { status };
    if (notes !== undefined) updates.notes = notes;

    const ok = await db.updateOrder(id, updates);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Tiket pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status pesanan #${id} berhasil diubah menjadi ${status}.`,
    });
  } catch (error: any) {
    console.error("Admin update order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memperbarui pesanan." },
      { status: 500 }
    );
  }
}

