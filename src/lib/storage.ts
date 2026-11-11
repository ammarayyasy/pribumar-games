import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function saveFile(
  file: File
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    if (!file) {
      return { success: false, error: "File tidak ditemukan" };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Format file tidak didukung. Harap upload format JPG, PNG, atau WebP.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Ukuran file terlalu besar. Maksimal ukuran file adalah 5MB.",
      };
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const uniqueName = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.promises.writeFile(destinationPath, buffer);

    return {
      success: true,
      path: `/uploads/${uniqueName}`,
    };
  } catch (error: any) {
    console.error("Storage saveFile error:", error);
    return {
      success: false,
      error: error.message || "Gagal menyimpan file media ke disk",
    };
  }
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    if (!filePath || !filePath.startsWith("/uploads/")) {
      return false;
    }

    const relativePath = filePath.replace(/^\/uploads\//, "");
    const fullPath = path.join(UPLOADS_DIR, relativePath);

    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Storage deleteFile error:", error);
    return false;
  }
}

