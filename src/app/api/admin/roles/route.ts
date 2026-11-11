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

  const roles = await db.getRoles();
  return NextResponse.json({ success: true, roles });
}

export async function POST(request: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: "Nama role dan deskripsi wajib diisi." },
        { status: 400 }
      );
    }

    const roles = await db.getRoles();
    if (roles.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Role dengan nama tersebut sudah ada." },
        { status: 400 }
      );
    }

    const newRole = await db.createRole({
      name: name.toLowerCase().trim(),
      description,
      permissions: permissions || "view_dashboard",
      is_system: false,
    });

    return NextResponse.json({ success: true, role: newRole });
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
    const { id, description, permissions, name } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID role wajib diisi." }, { status: 400 });
    }

    const roles = await db.getRoles();
    const target = roles.find((r) => r.id === id);
    if (!target) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan." }, { status: 404 });
    }

    const updates: any = {};
    if (description) updates.description = description;
    if (permissions) updates.permissions = permissions;
    if (name && !target.is_system) updates.name = name.toLowerCase().trim();

    await db.updateRole(id, updates);
    return NextResponse.json({ success: true, message: "Role berhasil diupdate." });
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
      return NextResponse.json({ success: false, error: "ID role wajib disertakan." }, { status: 400 });
    }

    const roles = await db.getRoles();
    const target = roles.find((r) => r.id === id);
    if (target?.is_system) {
      return NextResponse.json(
        { success: false, error: "Role bawaan sistem tidak boleh dihapus." },
        { status: 400 }
      );
    }

    await db.deleteRole(id);
    return NextResponse.json({ success: true, message: "Role berhasil dihapus." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
