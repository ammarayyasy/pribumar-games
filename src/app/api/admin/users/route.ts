import { NextResponse } from "next/server";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function checkAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak. Khusus admin." }, { status: 403 });
  }

  const users = await db.getUsers();
  const roles = await db.getRoles();

  // Strip password hash from returned users
  const safeUsers = users.map((u) => {
    const roleName = roles.find((r) => r.id === u.role_id)?.name || "user";
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role_id: u.role_id,
      role_name: roleName,
      status: u.status,
      created_at: u.created_at,
    };
  });

  return NextResponse.json({ success: true, users: safeUsers, roles });
}

export async function POST(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, email, password, role_id } = body;

    if (!name || !email || !password || !role_id) {
      return NextResponse.json({ success: false, error: "Semua kolom wajib diisi." }, { status: 400 });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ success: false, error: "Email sudah terdaftar." }, { status: 400 });
    }

    const hash = await hashPassword(password);
    const newUser = await db.createUser({
      name,
      email,
      password_hash: hash,
      role_id,
      status: "active",
    });

    return NextResponse.json({ success: true, user: newUser });
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
    const { id, role_id, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID user wajib disertakan." }, { status: 400 });
    }

    // Protection rule: Admin cannot deactivate or remove admin role of themselves
    if (id === admin.id) {
      if (status === "inactive") {
        return NextResponse.json(
          { success: false, error: "Anda tidak dapat menonaktifkan akun admin Anda sendiri." },
          { status: 400 }
        );
      }
    }

    const updates: any = {};
    if (role_id) updates.role_id = role_id;
    if (status) updates.status = status;

    await db.updateUser(id, updates);
    return NextResponse.json({ success: true, message: "User berhasil diperbarui." });
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
      return NextResponse.json({ success: false, error: "ID user wajib disertakan." }, { status: 400 });
    }

    // Protection rule: Admin cannot delete themselves
    if (id === admin.id) {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menghapus akun admin Anda sendiri." },
        { status: 400 }
      );
    }

    await db.deleteUser(id);
    return NextResponse.json({ success: true, message: "User berhasil dihapus." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
