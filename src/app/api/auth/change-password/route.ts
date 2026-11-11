import { NextResponse } from "next/server";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak valid. Silakan login kembali." },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Password lama dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal 6 karakter." },
        { status: 400 }
      );
    }

    const user = await db.findUserById(currentUser.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    const isValid = await verifyPassword(oldPassword, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Password lama tidak sesuai." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await db.updateUser(user.id, { password_hash: newHash });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui!",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat memperbarui password." },
      { status: 500 }
    );
  }
}

