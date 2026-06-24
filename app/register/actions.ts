"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Harap isi semua kolom!" };
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Registration error:", err);
    return { error: "Terjadi kesalahan sistem. Silakan coba kembali." };
  }
}
