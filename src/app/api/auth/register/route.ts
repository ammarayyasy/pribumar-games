import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nama, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar. Silakan gunakan email lain atau login." },
        { status: 400 }
      );
    }

    const roles = await db.getRoles();
    const defaultUserRole = roles.find((r) => r.name === "user") || roles[1] || roles[0];

    const passwordHash = await hashPassword(password);

    const newUser = await db.createUser({
      name,
      email,
      password_hash: passwordHash,
      role_id: defaultUserRole.id,
      status: "active",
    });

    const sessionToken = await createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: "user",
    });

    await setSessionCookie(sessionToken);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: "user",
      },
    });
  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat mendaftar." },
      { status: 500 }
    );
  }
}

