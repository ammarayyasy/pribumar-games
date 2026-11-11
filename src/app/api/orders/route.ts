import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu untuk membuat pesanan." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      game_id,
      game_name,
      item_id,
      item_name,
      price,
      account_id,
      zone_id,
      payment_method,
      whatsapp,
      notes,
    } = body;

    // Validasi input wajib
    if (!game_id || !game_name || !item_id || !item_name || !price || !account_id || !whatsapp) {
      return NextResponse.json(
        { success: false, error: "Data pesanan belum lengkap. Mohon lengkapi seluruh kolom wajib." },
        { status: 400 }
      );
    }

    if (Number(price) <= 0) {
      return NextResponse.json(
        { success: false, error: "Nominal pembayaran tidak valid." },
        { status: 400 }
      );
    }

    // Format ID Tiket unik Pribumar Games: PG-XXXXXX-YYY
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const ticketId = `PG-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const newOrder = await db.createOrder({
      id: ticketId,
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      game_id: String(game_id),
      game_name: String(game_name),
      item_id: String(item_id),
      item_name: String(item_name),
      price: Number(price),
      account_id: String(account_id).trim(),
      zone_id: String(zone_id || "").trim(),
      payment_method: String(payment_method || "QRIS"),
      whatsapp: String(whatsapp).trim(),
      status: "menunggu_konfirmasi",
      notes: notes ? String(notes).trim() : "",
    });

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat.",
      order: newOrder,
    });
  } catch (error: any) {
    console.error("Create order API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memproses pesanan." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Silakan login untuk melihat pesanan Anda." },
        { status: 401 }
      );
    }

    // Ambil pesanan khusus pengguna yang sedang login
    const orders = await db.getOrdersByUserId(user.id);

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error("Get user orders API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal memuat pesanan." },
      { status: 500 }
    );
  }
}

